const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'schema-diagram.json');
const outputDir = path.join(__dirname, 'app', 'lib', 'classes');

// Helper to parse the UML line and extract the visibility modifier
function parseUmlLine(line) {
  let visibility = 'public'; // Default fallback
  let cleanLine = line.trim();

  if (cleanLine.startsWith('+')) {
    visibility = 'public';
    cleanLine = cleanLine.substring(1).trim();
  } else if (cleanLine.startsWith('-')) {
    visibility = 'private';
    cleanLine = cleanLine.substring(1).trim();
  } else if (cleanLine.startsWith('#')) {
    visibility = 'protected';
    cleanLine = cleanLine.substring(1).trim();
  }

  return { visibility, definition: cleanLine };
}

function generateClasses() {
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

  // 1. Filter out only the UML Class nodes
  const umlNodes = nodes.filter((node) => node.type === 'uml');

  if (umlNodes.length === 0) {
    console.log('ℹ️ No UML class nodes found.');
    return;
  }

  // 2. Ensure "lib/classes/" directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 3. Process each UML node
  umlNodes.forEach((node) => {
    const { name, attributes, methods } = node.data;

    if (!name) return;

    // Parse attributes
    const parsedAttributes = attributes.map((attr) => {
      const { visibility, definition } = parseUmlLine(attr);
      return `  ${visibility} ${definition};`;
    });

    // Parse methods and generate a skeleton method body with a TODO
    const parsedMethods = (methods || []).map((method) => {
      const { visibility, definition } = parseUmlLine(method);
      return `  ${visibility} ${definition} {\n    // TODO: implement\n    throw new Error('Method not implemented.');\n  }`;
    });

    // 4. Build the class structure string
    const classContent = `export class ${name} {
${parsedAttributes.join('\n')}

  constructor() {
    // Constructor logic
  }
${parsedMethods.length > 0 ? '\n' + parsedMethods.join('\n\n') : ''}
}
`;

    // 5. Save the file (e.g., "lib/classes/User.ts")
    const fileName = `${name}.ts`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, classContent, 'utf8');
    console.log(`✅ Generated TS Class: ${path.relative(__dirname, outputPath)}`);
  });

  console.log('\n🎉 TypeScript Class generation complete!');
}

generateClasses();
