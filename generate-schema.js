const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'db-schemas');

function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
}

function generateSQL() {
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`❌ Error: Could not find "schema-diagram.json" in your project root.`);
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
    console.log('ℹ️ No database table nodes found.');
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;

    if (!tableName) return;

    const primaryKeys = columns.filter((col) => col.isPK).map((col) => col.name);

    const columnLines = columns.map((col) => {
      let line = `    ${col.name} ${col.type.toUpperCase()}`;

      // 1. Add NOT NULL constraint (Primary keys are always NOT NULL)
      if (col.isPK || col.isNotNull) {
        line += ' NOT NULL';
      }

      // 2. Add DEFAULT value constraint if specified
      if (col.defaultValue && col.defaultValue.trim() !== '') {
        const defaultVal = col.defaultValue.trim();
        line += ` DEFAULT ${defaultVal}`;
      }

      return line;
    });

    if (primaryKeys.length > 0) {
      columnLines.push(`    PRIMARY KEY (${primaryKeys.join(', ')})`);
    }

    const sqlStatement = columnLines.join(',\n');
    const pascalName = toPascalCase(tableName);

    // ==========================================
    // UPDATED TEMPLATE: Import sql from your local central db helper
    // ==========================================
    const fileContent = `import { sql } from '../db'; // Imports the shared pool from lib/db.ts

export async function create${pascalName}Table() {
  await sql\`
  CREATE TABLE IF NOT EXISTS ${tableName}
  (
${sqlStatement}
  );\`;
}
`;

    const fileName = `create-${tableName.replace(/_/g, '-')}-table.ts`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`✅ Generated: ${path.relative(__dirname, outputPath)}`);
  });

  console.log('\n🎉 SQL schema generation complete!');
}

generateSQL();
