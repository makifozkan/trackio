const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'lib', 'validation'); // Saves to lib/validation/

function generateValidation() {
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

  // Filter only zodSchema nodes
  const zodNodes = nodes.filter((node) => node.type === 'zodSchema');

  if (zodNodes.length === 0) {
    console.log('ℹ️ No Zod Schema nodes found.');
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  zodNodes.forEach((node) => {
    const { name, fields, operations } = node.data;

    if (!name) return;

    const fieldLines = fields.map((field) => {
      const validationChain = field.validation.trim();
      return `  ${field.name}: ${validationChain || 'z.any()'},`;
    });

    // 1. Base Schema + Base View Model Type (Inferred)
    let fileContent = `import { z } from 'zod';

export const ${name} = z.object({
${fieldLines.join('\n')}
});

// View Model Type for the entire form
export type ${name}Type = z.infer<typeof ${name}>;
`;

    // 2. Sub-schemas + Sub View Model Types (Inferred)
    if (operations && operations.length > 0) {
      fileContent += '\n'; // Add spacing

      operations.forEach((op) => {
        if (!op.name) return;

        if (op.omitFields.length > 0) {
          const omitObject = op.omitFields.map((field) => `${field}: true`).join(', ');
          fileContent += `export const ${op.name} = ${name}.omit({ ${omitObject} });\n`;
          fileContent += `export type ${op.name}Type = z.infer<typeof ${op.name}>;\n\n`; // Auto-inferred type
        } else {
          fileContent += `export const ${op.name} = ${name};\n`;
          fileContent += `export type ${op.name}Type = z.infer<typeof ${op.name}>;\n\n`; // Auto-inferred type
        }
      });
    }

    const fileName = `${name}.ts`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(
      `✅ Generated Zod Schema + View Model Types: ${path.relative(__dirname, outputPath)}`
    );
  });

  console.log('\n🎉 Zod Validation generation complete!');
}

generateValidation();
