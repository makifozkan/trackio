const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'db-handlers'); // Saves to lib/db-handlers/

// ==========================================
// UTILITY HELPERS
// ==========================================
function toPascalCase(str) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
}

function getPluralName(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith('y')) return lower.slice(0, -1) + 'ies';
  if (lower.endsWith('s')) return lower;
  return lower + 's';
}

function getSingularName(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith('ies')) return lower.slice(0, -3) + 'y';
  if (lower.endsWith('s')) return lower.slice(0, -1);
  return lower;
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

  const { nodes, edges } = diagramData;
  if (!nodes) return;

  const dbTableNodes = nodes.filter((node) => node.type === 'dbTable');

  if (dbTableNodes.length === 0) {
    console.log('ℹ️ No DB Table nodes found.');
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // =========================================================================
  // 1. RELATIONAL GRAPH GENERATOR
  // =========================================================================
  const relationsGraph = {};
  dbTableNodes.forEach((node) => {
    relationsGraph[node.data.tableName] = [];
  });

  const getRelations = (tableName) => {
    if (!relationsGraph[tableName]) relationsGraph[tableName] = [];
    return relationsGraph[tableName];
  };

  const isJunctionTableNode = (node) => {
    if (!node || node.type !== 'dbTable') return false;
    const cols = node.data.columns || [];
    const fks = cols.filter((c) => c.isFK);
    const pks = cols.filter((c) => c.isPK);
    return fks.length >= 2 && pks.length >= 2 && fks.every((c) => c.isPK);
  };

  // A. Parse standard edges (1:1 and 1:N)
  if (edges && edges.length > 0) {
    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (
        sourceNode &&
        targetNode &&
        sourceNode.type === 'dbTable' &&
        targetNode.type === 'dbTable'
      ) {
        if (!isJunctionTableNode(sourceNode) && !isJunctionTableNode(targetNode)) {
          const parentTable = sourceNode.data.tableName;
          const childTable = targetNode.data.tableName;
          const fkColumn = `${getSingularName(parentTable)}_id`;

          const relationType =
            edge.data?.relationType ||
            (edge.label?.includes('1-to-1') ? 'one-to-one' : 'one-to-many');

          // Parent links to child list or object
          getRelations(parentTable).push({
            propertyName:
              relationType === 'one-to-one'
                ? getSingularName(childTable)
                : getPluralName(childTable),
            relationType,
            targetTable: childTable,
            fkColumn,
            isParent: true,
          });

          // Child links to standard single parent
          getRelations(childTable).push({
            propertyName: getSingularName(parentTable),
            relationType,
            targetTable: parentTable,
            fkColumn,
            isParent: false,
          });
        }
      }
    });
  }

  // B. Parse Many-to-Many junctions
  dbTableNodes.forEach((node) => {
    if (isJunctionTableNode(node)) {
      const jTable = node.data.tableName;
      const columns = node.data.columns || [];
      const fks = columns.filter((col) => col.isFK);

      const tableA_Singular = fks[0].name.replace(/_id$/, '');
      const tableB_Singular = fks[1].name.replace(/_id$/, '');

      let tableA = `${tableA_Singular}s`;
      let tableB = `${tableB_Singular}s`;
      if (tableA_Singular.endsWith('y')) tableA = `${tableA_Singular.slice(0, -1)}ies`;
      if (tableB_Singular.endsWith('y')) tableB = `${tableB_Singular.slice(0, -1)}ies`;
      if (tableA_Singular === 'user_v2') tableA = 'users_v2';
      if (tableB_Singular === 'user_v2') tableB = 'users_v2';

      getRelations(tableA).push({
        propertyName: getPluralName(tableB),
        relationType: 'many-to-many',
        targetTable: tableB,
        junctionTable: jTable,
        myFk: fks[0].name,
        theirFk: fks[1].name,
        isParent: true,
      });

      getRelations(tableB).push({
        propertyName: getPluralName(tableA),
        relationType: 'many-to-many',
        targetTable: tableA,
        junctionTable: jTable,
        myFk: fks[1].name,
        theirFk: fks[0].name,
        isParent: true,
      });
    }
  });

  // ==========================================
  // 3. FILE COMPILATION
  // ==========================================
  dbTableNodes.forEach((node) => {
    const { tableName, columns } = node.data;
    if (!tableName) return;

    const pascalName = toPascalCase(tableName);
    const pks = columns.filter((col) => col.isPK);
    const nonPks = columns.filter((col) => !col.isPK);

    // Exclude SERIAL and defaults from INSERT
    const insertColumns = columns.filter((col) => {
      const isAutoId = col.type.toUpperCase() === 'SERIAL';
      const hasDefault = col.defaultValue && col.defaultValue.trim() !== '';
      return !col.isPK && !isAutoId && !hasDefault;
    });

    const pkArgs = pks.map((pk) => `${pk.name}: any`).join(', ');
    const pkWhereClause = pks.map((pk) => `t.${pk.name} = \${${pk.name}}`).join(' AND ');
    const pkPassArgs = pks.map((pk) => pk.name).join(', ');

    const columnNamesList = columns.map((col) => col.name).join(', ');
    const nonPkNamesList = insertColumns.map((col) => col.name).join(', ');
    const nonPkValuesList = insertColumns.map((col) => `\${data.${col.name} ?? null}`).join(', ');
    const updateFieldsList = insertColumns.map((col) => `'${col.name}'`).join(', ');

    const myRelations = getRelations(tableName);
    const relationKeys = myRelations.map((r) => `'${r.propertyName}'`);

    const includeType = relationKeys.length > 0 ? relationKeys.join(' | ') : 'never';
    const fetchOptionsDef = `export type ${pascalName}Include = ${includeType};

export interface ${pascalName}FetchOptions {
  include?: ${pascalName}Include[];
}`;

    // =========================================================================
    // NATIVE POSTGRESQL JSON AGGREGATION SINGLE-QUERY GENERATORS
    // =========================================================================
    const singleEagerLoaders = myRelations
      .map((rel) => {
        const targetNode = dbTableNodes.find((n) => n.data.tableName === rel.targetTable);
        const targetCols = targetNode ? targetNode.data.columns : [];
        const jsonBuildArgs = targetCols.map((c) => `'${c.name}', r.${c.name}`).join(', ');

        if (rel.relationType === 'many-to-many') {
          // Many-to-Many (INNER JOIN Sub-query aggregation)
          return `    if (options?.include?.includes('${rel.propertyName}')) {
      selectFields.push(sql\`(
        SELECT COALESCE(json_agg(json_build_object(${jsonBuildArgs})), '[]'::json)
        FROM ${rel.targetTable} r
        INNER JOIN ${rel.junctionTable} j ON r.id = j.${rel.theirFk}
        WHERE j.${rel.myFk} = t.id
      ) as ${rel.propertyName}\`);
    }`;
        } else if (rel.relationType === 'one-to-one' || !rel.isParent) {
          // One-to-One or Child reference (Return singular JSON object, fallback to NULL)
          return `    if (options?.include?.includes('${rel.propertyName}')) {
      selectFields.push(sql\`(
        SELECT json_build_object(${jsonBuildArgs})
        FROM ${rel.targetTable} r
        WHERE r.id = t.${rel.fkColumn}
        LIMIT 1
      ) as ${rel.propertyName}\`);
    }`;
        } else {
          // One-to-Many (Standard sub-query aggregation)
          return `    if (options?.include?.includes('${rel.propertyName}')) {
      selectFields.push(sql\`(
        SELECT COALESCE(json_agg(json_build_object(${jsonBuildArgs})), '[]'::json)
        FROM ${rel.targetTable} r
        WHERE r.${rel.fkColumn} = t.id
      ) as ${rel.propertyName}\`);
    }`;
        }
      })
      .join('\n\n');

    // ==========================================
    // HANDLERS FILE TEMPLATE
    // ==========================================
    const fileContent = `import { sql } from '../db';
import { ${pascalName} } from '../types/${pascalName}'; // Import central type from generate-types.js

${fetchOptionsDef}

/**
 * FETCH ALL RECORDS
 */
export async function fetchAll${pascalName}s(): Promise<${pascalName}[]> {
  try {
    const data = (await sql\`
      SELECT ${columnNamesList}
      FROM ${tableName}
    \`) as unknown as ${pascalName}[];
    return data;
  } catch (error) {
    console.error('Database Error: Failed to fetch ${tableName} records.', error);
    throw new Error('Could not retrieve data. Please try again later.');
  }
}

/**
 * FETCH SINGLE RECORD BY PRIMARY KEY(S) (With optional high-performance eager sub-joins)
 */
export async function fetch${pascalName}ById(${pkArgs}, options?: ${pascalName}FetchOptions): Promise<${pascalName} | null> {
  try {
    // Array of standard table column select fragments
    const selectFields = [
      ${columns.map((col) => `sql\`t.${col.name}\``).join(',\n      ')}
    ] as any[];

    // Push relational aggregates dynamically into the SELECT clause
    if (options?.include) {
${singleEagerLoaders}
    }

    // Execute exactly one single database roundtrip!
    const data = (await sql\`
      SELECT \${selectFields}
      FROM ${tableName} t
      WHERE ${pkWhereClause}
    \`) as unknown as ${pascalName}[];
    
    return data[0] || null;
  } catch (error) {
    console.error(\`Database Error: Failed to fetch ${tableName} with key(s): \`, { ${pkPassArgs} }, error);
    throw new Error('Could not retrieve record.');
  }
}

/**
 * CREATE NEW RECORD
 */
export async function create${pascalName}(data: Omit<${pascalName}, ${pks.map((pk) => `'${pk.name}'`).join(' | ')}>): Promise<${pascalName}> {
  try {
    const result = (await sql\`
      INSERT INTO ${tableName} (${nonPkNamesList})
      VALUES (${nonPkValuesList})
      RETURNING ${columnNamesList}
    \`) as unknown as ${pascalName}[];
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
    // If the payload is empty, skip database execution and return the current record
    if (Object.keys(data).length === 0) {
      return (await fetch${pascalName}ById(${pkPassArgs}))!;
    }

    // Dynamically filter allowed update keys to exclude any that are undefined
    const allowedKeys = [${updateFieldsList}];
    const keysToUpdate = allowedKeys.filter((key) => (data as any)[key] !== undefined);

    // Resolve column helper using only valid keys
    const updateColumns = sql(data, ...(keysToUpdate as any[])) as any;

    const result = (await sql\`
      UPDATE ${tableName}
      SET \${updateColumns}
      WHERE ${pkWhereClause.replace(/t\./g, '')}
      RETURNING ${columnNamesList}
    \`) as unknown as ${pascalName}[];

    return result[0];
  } catch (error) {
    console.error(\`Database Error: Failed to update ${tableName} with key(s): \`, { ${pkPassArgs} }, error);
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
      WHERE ${pkWhereClause.replace(/t\./g, '')}
    \`;
    return { success: true };
  } catch (error) {
    console.error(\`Database Error: Failed to delete ${tableName} with key(s): \`, { ${pkPassArgs} }, error);
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
