const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'db-handlers');

function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
}

function generateHandlers() {
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
    console.log('ℹ️ No DB Table nodes found.');
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;
    if (!tableName) return;

    const pascalName = toPascalCase(tableName);
    const pks = columns.filter((col) => col.isPK);
    const nonPks = columns.filter((col) => !col.isPK);

    // Build PK query args and WHERE clause strings (Supports Composite Keys)
    const pkArgs = pks.map((pk) => `${pk.name}: any`).join(', '); // Types are handled by the imported interface
    const pkWhereClause = pks.map((pk) => `${pk.name} = \${${pk.name}}`).join(' AND ');

    // Column lists for Select and Insert
    const columnNamesList = columns.map((col) => col.name).join(', ');
    const nonPkNamesList = nonPks.map((col) => col.name).join(', ');
    const nonPkValuesList = nonPks.map((col) => `\${data.${col.name}}`).join(', ');

    // Build Update assignments
    const updateAssignments = nonPks
      .map(
        (col) =>
          `      ${col.name} = \${data.${col.name} !== undefined ? data.${col.name} : sql\`\${${col.name}}\`}`
      )
      .join(',\n');

    // ==========================================
    // UPDATED TEMPLATE: Import types from lib/types/
    // ==========================================
    const fileContent = `import { sql } from '../db';
import { ${pascalName} } from '../types/${pascalName}'; // Import central type from generate-types.js

/**
 * FETCH ALL RECORDS
 */
export async function fetchAll${pascalName}s(): Promise<${pascalName}[]> {
  try {
    const data = await sql<${pascalName}[]>\`
      SELECT ${columnNamesList}
      FROM ${tableName}
    \`;
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch ${tableName} records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S)
 */
export async function fetch${pascalName}ById(${pkArgs}): Promise<${pascalName} | null> {
  try {
    const data = await sql<${pascalName}[]>\`
      SELECT ${columnNamesList}
      FROM ${tableName}
      WHERE ${pkWhereClause}
    \`;
    return data[0] || null;
  } catch (error) {
    console.error(\`Database Error: Failed to fetch ${tableName} with key(s): \`, { ${pks.map((pk) => pk.name).join(', ')} }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function create${pascalName}(data: Omit<${pascalName}, ${pks.map((pk) => `'${pk.name}'`).join(' | ')}>): Promise<${pascalName}> {
  try {
    const result = await sql<${pascalName}[]>\`
      INSERT INTO ${tableName} (${nonPkNamesList})
      VALUES (${nonPkValuesList})
      RETURNING ${columnNamesList}
    \`;
    return result[0];
  } catch (error) {
    console.error('Database Error: Failed to create ${tableName} record.', error);
    throw new Error('Could not create record.');
  }
}

/**
 * UPDATE EXISTING RECORD (SAFE PARTIAL UPDATE)
 */
export async function update${pascalName}(${pkArgs}, data: Partial<Omit<${pascalName}, ${pks.map((pk) => `'${pk.name}'`).join(' | ')}>>): Promise<${pascalName}> {
  try {
    const result = await sql<${pascalName}[]>\`
      UPDATE ${tableName}
      SET
${updateAssignments}
      WHERE ${pkWhereClause}
      RETURNING ${columnNamesList}
    \`;
    return result[0];
  } catch (error) {
    console.error(\`Database Error: Failed to update ${tableName} with key(s): \`, { ${pks.map((pk) => pk.name).join(', ')} }, error);
    throw new Error('Could not update record.');
  }
}

/**
 * DELETE RECORD
 */
export async function delete${pascalName}(${pkArgs}): Promise<{ success: boolean }> {
  try {
    await sql\`
      DELETE FROM ${tableName}
      WHERE ${pkWhereClause}
    \`;
    return { success: true };
  } catch (error) {
    console.error(\`Database Error: Failed to delete ${tableName} with key(s): \`, { ${pks.map((pk) => pk.name).join(', ')} }, error);
    throw new Error('Could not delete record.');
  }
}
`;

    const fileName = `${tableName}-handlers.ts`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`✅ Generated DB Handlers: ${path.relative(__dirname, outputPath)}`);
  });

  console.log('\n🎉 DB CRUD Handlers generation complete!');
}

generateHandlers();
