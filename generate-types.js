const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'types'); // Outputs to lib/types/

// Helper to strip any accidentally typed UML modifiers (+ or -)
function parseUmlLine(line) {
  let cleanLine = line.trim();
  if (cleanLine.startsWith('+') || cleanLine.startsWith('-') || cleanLine.startsWith('#')) {
    cleanLine = cleanLine.substring(1).trim();
  }
  return cleanLine;
}

function generateTypes() {
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

  // 1. Target ONLY the dedicated dataClass nodes
  const dataClassNodes = nodes.filter((node) => node.type === 'dataClass');

  if (dataClassNodes.length === 0) {
    console.log('ℹ️ No Data Class nodes found.');
    return;
  }

  // 2. Ensure "lib/types/" exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 3. Generate a clean TypeScript type alias for each node
  dataClassNodes.forEach((node) => {
    const { name, attributes } = node.data;

    if (!name) return;

    const parsedAttributes = attributes.map((attr) => {
      const definition = parseUmlLine(attr);
      const formattedLine = definition.endsWith(';') ? definition : `${definition};`;
      return `  ${formattedLine}`;
    });

    const fileContent = `export type ${name} = {
${parsedAttributes.join('\n')}
};
`;

    const fileName = `${name}.ts`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`✅ Generated TS Type: ${path.relative(__dirname, outputPath)}`);
  });

  console.log('\n🎉 Plain Type generation complete!');
}

generateTypes();
