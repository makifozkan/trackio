const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'db-handlers');

// Helper to convert SQL types to TS types
function sqlToTsType(sqlType) {
  const type = sqlType.toUpperCase();
  if (
    type.includes('INT') ||
    type.includes('DECIMAL') ||
    type.includes('NUMERIC') ||
    type.includes('FLOAT') ||
    type.includes('REAL')
  ) {
    return 'number';
  }
  if (type.includes('BOOL')) {
    return 'boolean';
  }
  if (type.includes('DATE') || type.includes('TIME') || type.includes('TIMESTAMP')) {
    return 'Date | string';
  }
  return 'string'; // Default fallback (TEXT, VARCHAR, UUID etc)
}

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

    // 1. Generate local TypeScript types based on the columns
    const tsFields = columns.map((col) => `  ${col.name}: ${sqlToTsType(col.type)};`);
    const typeDef = `export type Db${pascalName} = {\n${tsFields.join('\n')}\n};`;

    // 2. Build PK query args and WHERE clause strings (Supports Composite Keys)
    const pkArgs = pks.map((pk) => `${pk.name}: ${sqlToTsType(pk.type)}`).join(', ');
    const pkWhereClause = pks.map((pk) => `${pk.name} = \${${pk.name}}`).join(' AND ');

    // Column lists for Select and Insert
    const columnNamesList = columns.map((col) => col.name).join(', ');
    const nonPkNamesList = nonPks.map((col) => col.name).join(', ');
    const nonPkValuesList = nonPks.map((col) => `\${data.${col.name}}`).join(', ');

    // 3. Build Update assignments (e.g. name = ${data.name})
    const updateAssignments = nonPks
      .map(
        (col) =>
          `      ${col.name} = \${data.${col.name} !== undefined ? data.${col.name} : sql\`\${${col.name}}\`}`
      )
      .join(',\n');

    // 4. Construct the complete CRUD handler file content
    const fileContent = `import { sql } from '../db';

${typeDef}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAll${pascalName}s(): Promise<Db${pascalName}[]> {
  try {
    const data = await sql<Db${pascalName}[]>\`
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
export async function fetch${pascalName}ById(${pkArgs}): Promise<Db${pascalName} | null> {
  try {
    const data = await sql<Db${pascalName}[]>\`
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
export async function create${pascalName}(data: Omit<Db${pascalName}, ${pks.map((pk) => `'${pk.name}'`).join(' | ')}>): Promise<Db${pascalName}> {
  try {
    const result = await sql<Db${pascalName}[]>\`
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
export async function update${pascalName}(${pkArgs}, data: Partial<Omit<Db${pascalName}, ${pks.map((pk) => `'${pk.name}'`).join(' | ')}>>): Promise<Db${pascalName}> {
  try {
    const result = await sql<Db${pascalName}[]>\`
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
