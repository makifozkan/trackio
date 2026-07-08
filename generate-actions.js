const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'actions');

function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
}

function generateActions() {
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ Error: Could not find "schema-diagram.json".`);
    return;
  }

  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  let diagramData;
  try {
    diagramData = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Error parsing schema-diagram.json:', err.message);
    return;
  }

  const { nodes } = diagramData;
  if (!nodes) return;

  const dbTableNodes = nodes.filter((node) => node.type === 'dbTable');

  if (dbTableNodes.length === 0) {
    console.log('ℹ️ No DB Table nodes found. Skipping Actions generation.');
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;
    if (!tableName || !columns) return;

    const pascalName = toPascalCase(tableName);
    const pks = columns.filter((col) => col.isPK);

    const pkArgs = pks.map((pk) => `${pk.name}: any`).join(', ');
    const pkPassArgs = pks.map((pk) => pk.name).join(', ');

    // Identify which columns are images
    const imageCols = columns.filter(
      (col) => col.name.toLowerCase().includes('image') || col.name.toLowerCase().includes('avatar')
    );

    // 1. Bulletproof check using "instanceof File" to prevent empty file objects from reaching Zod
    const base64ConverterCode = imageCols
      .map(
        (col) => `
  const ${col.name}File = formData.get('${col.name}');
  if (${col.name}File instanceof File && ${col.name}File.size > 0) {
    const buffer = Buffer.from(await ${col.name}File.arrayBuffer());
    rawFields.${col.name} = \`data:\${${col.name}File.type};base64,\${buffer.toString('base64')}\`;
  } else {
    // Correct: Completely strip empty files or null boundaries so Zod and Postgres ignore them during updates
    delete rawFields.${col.name};
  }`
      )
      .join('\n');

    // ==========================================
    // ACTIONS TEMPLATE WITH AUTOMATED BASE64 COMPILER
    // ==========================================
    const fileContent = `'use server';

import { revalidatePath } from 'next/cache';
import { Create${pascalName}, Update${pascalName} } from '../validation/${pascalName}Schema';
import { create${pascalName}, update${pascalName}, delete${pascalName} } from '../db-handlers/${tableName}-handlers';

export type ActionState = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string | null;
};

/**
 * CREATE ACTION
 */
export async function create${pascalName}Action(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into valid base64 strings securely on the server
  ${base64ConverterCode}

  // Validate inputs with Zod
  const validatedFields = Create${pascalName}.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  try {
    await create${pascalName}(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  revalidatePath('/dashboard/${tableName}');

  return {
    success: true,
    message: '${pascalName} created successfully!',
  };
}

/**
 * UPDATE ACTION
 */
export async function update${pascalName}Action(
  ${pkArgs},
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const rawFields = { ...Object.fromEntries(formData.entries()) };

  // Convert File binary uploads into base64 strings during modifications
  ${base64ConverterCode}

  const validatedFields = Update${pascalName}.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify updated fields.',
    };
  }

  try {
    await update${pascalName}(${pkPassArgs}, validatedFields.data as any);
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Update Failure. Could not apply modifications.',
    };
  }

  revalidatePath('/dashboard/${tableName}');

  return {
    success: true,
    message: '${pascalName} modifications saved!',
  };
}

/**
 * DELETE ACTION
 */
export async function delete${pascalName}Action(${pkArgs}): Promise<ActionState> {
  try {
    await delete${pascalName}(${pkPassArgs});
  } catch (error) {
    console.error('Action Error:', error);
    return {
      success: false,
      message: 'Database Deletion Failure.',
    };
  }

  revalidatePath('/dashboard/${tableName}');

  return {
    success: true,
    message: '${pascalName} record deleted successfully.',
  };
}
`;

    const fileName = `${tableName}-actions.ts`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(
      `✅ Generated Server Actions with Base64 compiler: ${path.relative(__dirname, outputPath)}`
    );
  });

  console.log('\n🎉 Action compiler update complete!');
}

generateActions();
