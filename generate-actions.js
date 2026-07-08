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

  // We generate actions for each database table
  const dbTableNodes = nodes.filter((node) => node.type === 'dbTable');

  if (dbTableNodes.length === 0) {
    console.log('ℹ️ No DB Table nodes found. Skipping Actions generation.');
    return;
  }

  // Ensure "lib/actions/" folder exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;
    if (!tableName) return;

    const pascalName = toPascalCase(tableName);
    const pks = columns.filter((col) => col.isPK);

    const pkArgs = pks.map((pk) => `${pk.name}: any`).join(', ');
    const pkPassArgs = pks.map((pk) => pk.name).join(', ');

    // ==========================================
    // SERVER ACTIONS GENERATION TEMPLATE
    // ==========================================
    const fileContent = `'use server';

import { revalidatePath } from 'next/cache';
import { Create${pascalName}, Update${pascalName} } from '../validation/${pascalName}Schema';
import { create${pascalName}, update${pascalName}, delete${pascalName} } from '../db-handlers/${tableName}-handlers';

// Standard state payload structure returned to Next.js form state hooks
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
  // 1. Convert form inputs to structured JSON object
  const rawFields = Object.fromEntries(formData.entries());

  // 2. Validate inputs with Zod
  const validatedFields = Create${pascalName}.safeParse(rawFields);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please verify your fields.',
    };
  }

  // 3. Write data to PostgreSQL
  try {
    await create${pascalName}(validatedFields.data as any);
  } catch (error) {
    console.error('Action Error: Failed to create ${tableName} record.', error);
    return {
      success: false,
      message: 'Database Write Failure. Could not register record.',
    };
  }

  // 4. Force Next.js App Router cache to refresh for this page path
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
  const rawFields = Object.fromEntries(formData.entries());

  // Validate inputs with Zod (using the Omit schema)
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
    console.error('Action Error: Failed to update ${tableName} record.', error);
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
    console.error('Action Error: Failed to delete ${tableName} record.', error);
    return {
      success: false,
      message: 'Database Deletion Failure. Action rolled back.',
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
    console.log(`✅ Generated Server Actions: ${path.relative(__dirname, outputPath)}`);
  });

  console.log('\n🎉 Server Actions generation complete!');
}

generateActions();
