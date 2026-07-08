'use client';

import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  MarkerType,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UmlNode from './uml-node';
import Sidebar from './sidebar';
import DbTableNode from './db-table-node';
import DataClassNode from './data-class-node';
import { DATA_CLASS_PRESETS, DB_TABLE_PRESETS } from './presets';
import ZodNode from './zod-node';

const toPascalCase = (str: string) => {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
};

// 2. Map your custom "uml" node type to the UmlNode React Component.
// It is important to define this object OUTSIDE of your component to prevent re-renders.
const nodeTypes = {
  uml: UmlNode,
  dbTable: DbTableNode,
  dataClass: DataClassNode,
  zodSchema: ZodNode,
};

const initialNodes: Node[] = [
  {
    id: 'invoice-zod-schema',
    type: 'zodSchema', // Use the custom zodSchema node type
    position: { x: 100, y: 100 },
    data: {
      name: 'FormSchema', // Name of the base schema
      fields: [
        {
          name: 'id',
          validation: 'z.string()',
        },
        {
          name: 'customerId',
          validation: "z.string({ invalid_type_error: 'Please select a customer.' })",
        },
        {
          name: 'amount',
          validation:
            "z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' })",
        },
        {
          name: 'status',
          validation:
            "z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' })",
        },
        {
          name: 'date',
          validation: 'z.string()',
        },
      ],
      operations: [
        {
          name: 'CreateInvoice',
          omitFields: ['id', 'date'], // These fields will be omitted in CreateInvoice
        },
        {
          name: 'UpdateInvoice',
          omitFields: ['id', 'date'], // These fields will be omitted in UpdateInvoice
        },
      ],
    },
  },
  {
    id: 'user-type',
    type: 'dataClass', // Start with one DB Table node
    position: { x: 100, y: 100 },
    data: {
      name: 'LatestInvoice',
      attributes: ['id: string', 'name: string'],
    },
  },
  {
    id: 'user-table',
    type: 'dbTable', // Start with one DB Table node
    position: { x: 100, y: 100 },
    data: {
      tableName: 'users',
      columns: [
        { name: 'id', type: 'INT', isPK: true },
        { name: 'email', type: 'VARCHAR(255)', isPK: false, isFK: false },
      ],
    },
  },
  {
    id: 'user-class',
    type: 'uml', // Uses the custom "uml" node type we registered
    position: { x: 50, y: 50 },
    data: {
      name: 'User',
      attributes: ['+ id: string', '- email: string', '- passwordHash: string'],
      methods: [
        '+ validatePassword(pwd: string): boolean',
        '+ updateEmail(newEmail: string): void',
      ],
    },
  },
  {
    id: 'db-interface',
    type: 'uml',
    position: { x: 50, y: 300 },
    data: {
      name: 'Repository',
      stereotype: 'interface', // Adds <<interface>> to the header
      attributes: ['+ dbConnection: Connection'],
      methods: ['+ findById(id: string): User', '+ save(user: User): void'],
    },
  },
];

const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    target: 'n2',
    markerEnd: {
      type: MarkerType.ArrowClosed, // Can also be MarkerType.Arrow (open arrow)
      color: '#333', // Color of the arrow
    },
  },
];

export default function Builder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Track which node is currently selected
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            // --- Merge the markerEnd configuration into new connections ---
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#333',
            },
          },
          eds
        )
      ),
    []
  );

  // 1. Capture when a node is clicked
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  // 2. Clear selection when clicking on the empty canvas background
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // 3. Update node data from the Sidebar
  const handleUpdateNodeData = (id: string, newData: any) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          };
        }
        return node;
      })
    );
  };

  const handleAddZodSchemaNode = () => {
    const id = `zod-node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'zodSchema',
        position: { x: 200, y: 200 },
        data: {
          name: 'FormSchema',
          fields: [
            { name: 'id', validation: 'z.string()' },
            {
              name: 'customerId',
              validation: "z.string({ invalid_type_error: 'Please select a customer.' })",
            },
            {
              name: 'amount',
              validation:
                "z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' })",
            },
            {
              name: 'status',
              validation:
                "z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.' })",
            },
            { name: 'date', validation: 'z.string()' },
          ],
          operations: [
            { name: 'CreateInvoice', omitFields: ['id', 'date'] },
            { name: 'UpdateInvoice', omitFields: ['id', 'date'] },
          ],
        },
      },
    ]);
    setSelectedNodeId(id);
  };

  // --- Add Data Class Handler (New) ---
  // Accept a template type (defaults to 'blank' if not specified)
  const handleAddDataClassNode = (presetKey: keyof typeof DATA_CLASS_PRESETS = 'blank') => {
    const id = `dataclass-node-${Date.now()}`;
    const preset = DATA_CLASS_PRESETS[presetKey];

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'dataClass',
        position: {
          x: 100 + Math.random() * 100,
          y: 100 + Math.random() * 100,
        },
        data: {
          name: preset.name,
          attributes: [...preset.attributes], // Copy the preset attributes
        },
      },
    ]);
    setSelectedNodeId(id);
  };

  // --- Add UML Node ---
  const handleAddUmlNode = () => {
    const id = `uml-node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'uml',
        position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
        data: { name: 'NewClass', attributes: ['+ id: string'], methods: [] },
      },
    ]);
    setSelectedNodeId(id);
  };

  // --- Add DB Table Node ---
  const handleAddDbTableNode = () => {
    const id = `db-node-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'dbTable',
        position: { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 },
        data: {
          tableName: 'new_table',
          columns: [{ name: 'id', type: 'INT', isPK: true }],
        },
      },
    ]);
    setSelectedNodeId(id);
  };

  // --- Add Node Handler ---
  const handleAddNode = () => {
    const id = `uml-node-${Date.now()}`; // Unique ID using timestamp

    const newNode = {
      id,
      type: 'uml',
      // Start near the center with a minor random offset so they don't stack
      position: {
        x: 100 + Math.random() * 100,
        y: 100 + Math.random() * 100,
      },
      data: {
        name: 'NewClass',
        attributes: ['+ id: string'],
        methods: [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id); // Auto-focus the sidebar on the newly created node
  };

  const handleAutowireZodSchema = (tableNode: any) => {
    const { tableName, columns } = tableNode.data;
    if (!tableName) return;

    const pascalName = toPascalCase(tableName);

    // Map SQL Column Types to Zod Validation types
    const mappedFields = columns.map((col: any) => {
      let zodType = 'string'; // Default fallback
      const sqlType = col.type.toUpperCase();

      if (
        sqlType.includes('INT') ||
        sqlType.includes('SERIAL') ||
        sqlType.includes('DECIMAL') ||
        sqlType.includes('BIGINT')
      ) {
        zodType = 'number';
      }

      return {
        name: col.name,
        type: zodType,
        errorMessage: col.isPK ? '' : `Please enter a valid ${col.name}.`,
      };
    });

    const id = `zod-node-${Date.now()}`;

    // Create the new Zod Schema node
    const newZodSchemaNode = {
      id,
      type: 'zodSchema',
      // Position it 300 pixels to the right, and slightly below the DB Table node
      position: {
        x: tableNode.position.x + 300,
        y: tableNode.position.y + 120,
      },
      data: {
        name: `${pascalName}Schema`, // e.g. "UsersSchema"
        fields: mappedFields,
        // Auto-configure the standard Create/Update sub-schemas
        operations: [
          { name: `Create${pascalName}`, omitFields: [] },
          { name: `Update${pascalName}`, omitFields: [] },
        ],
      },
    };

    setNodes((nds) => [...nds, newZodSchemaNode]);
    setSelectedNodeId(id); // Auto-focus the sidebar on the newly created schema
  };

  const handleAutowireDataClass = (tableNode: any) => {
    const { tableName, columns } = tableNode.data;
    if (!tableName) return;

    const pascalName = toPascalCase(tableName);

    // Map SQL Column Types to TypeScript Types
    const mappedAttributes = columns.map((col: any) => {
      let tsType = 'string'; // Default fallback
      const sqlType = col.type.toUpperCase();

      if (
        sqlType.includes('INT') ||
        sqlType.includes('SERIAL') ||
        sqlType.includes('DECIMAL') ||
        sqlType.includes('BIGINT')
      ) {
        tsType = 'number';
      } else if (sqlType.includes('BOOL')) {
        tsType = 'boolean';
      }

      return `${col.name}: ${tsType}`;
    });

    const id = `dataclass-node-${Date.now()}`;

    // Create the new Data Class node
    const newDataClassNode = {
      id,
      type: 'dataClass',
      // Position it 300 pixels to the right of the DB Table node
      position: {
        x: tableNode.position.x + 300,
        y: tableNode.position.y,
      },
      data: {
        name: pascalName,
        attributes: mappedAttributes,
      },
    };

    setNodes((nds) => [...nds, newDataClassNode]);
    setSelectedNodeId(id); // Auto-focus the sidebar on the newly created type
  };

  // --- Delete Node Handler ---
  const handleDeleteNode = (idToDelete: string) => {
    // 1. Remove the node
    setNodes((nds) => nds.filter((node) => node.id !== idToDelete));

    // 2. Automatically remove any connected lines (edges) attached to this node
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== idToDelete && edge.target !== idToDelete)
    );

    // 3. Close the sidebar
    setSelectedNodeId(null);
  };

  // Find the node object that matches our selected ID
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Button style for top panel
  const topBtnStyle: React.CSSProperties = {
    padding: '8px 14px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  };

  // --- Export JSON Handler ---
  const handleExportJson = () => {
    // 1. Package the nodes and edges state into a single object
    const exportData = {
      nodes,
      edges,
    };

    // 2. Convert the object to a formatted JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // 3. Create a blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // 4. Create a temporary URL pointing to that blob
    const url = URL.createObjectURL(blob);

    // 5. Create a hidden <a> link and simulate clicking it to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema-diagram.json'; // Set the default download filename
    document.body.appendChild(link);
    link.click();

    // 6. Cleanup by removing the temporary link and URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddDbTablePreset = (presetKey: keyof typeof DB_TABLE_PRESETS) => {
    const id = `db-node-${Date.now()}`;
    const preset = DB_TABLE_PRESETS[presetKey];

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'dbTable',
        position: {
          x: 100 + Math.random() * 100,
          y: 100 + Math.random() * 100,
        },
        data: {
          tableName: preset.tableName,
          // Deep copy columns array to prevent shared references
          columns: preset.columns.map((col) => ({ ...col })),
        },
      },
    ]);
    setSelectedNodeId(id); // Auto-focus sidebar on the spawned table
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flexGrow: 1, height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          {/* Floating Action Bar */}
          {/* Floating Action Bar */}
          <Panel
            position="top-left"
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '600px' }}
          >
            <button onClick={handleAddUmlNode} style={{ ...topBtnStyle, background: '#0066cc' }}>
              + Add Class
            </button>
            <button
              onClick={handleAddZodSchemaNode}
              style={{ ...topBtnStyle, background: '#4f46e5' }}
            >
              + Add Zod Schema
            </button>
            <button
              onClick={handleAddDbTableNode}
              style={{ ...topBtnStyle, background: '#e28743' }}
            >
              + Add DB Table
            </button>

            {/* --- Data Class Presets --- */}
            <button
              onClick={() => handleAddDataClassNode('blank')}
              style={{ ...topBtnStyle, background: '#008080' }}
            >
              + Custom Type
            </button>
            <button
              onClick={() => handleAddDataClassNode('user')}
              style={{ ...topBtnStyle, background: '#009999' }}
            >
              + Add User Preset
            </button>
            <button
              onClick={() => handleAddDataClassNode('product')}
              style={{ ...topBtnStyle, background: '#009999' }}
            >
              + Add Product Preset
            </button>
            <button
              onClick={() => handleAddDataClassNode('invoice')}
              style={{ ...topBtnStyle, background: '#009999' }}
            >
              + Add Invoice Preset
            </button>
            {/* --- NEW: DB Table Presets Dropdown --- */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddDbTablePreset(e.target.value as any);
                  e.target.value = ''; // Reset select to default placeholder
                }
              }}
              style={{
                ...topBtnStyle,
                background: '#e28743',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" style={{ background: '#fff', color: '#222' }}>
                📋 Add DB Table Preset...
              </option>
              <option value="users" style={{ background: '#fff', color: '#222' }}>
                users (Auth & Profile)
              </option>
              <option value="sessions" style={{ background: '#fff', color: '#222' }}>
                sessions (NextAuth sessions)
              </option>
              <option value="products" style={{ background: '#fff', color: '#222' }}>
                products (E-commerce Catalog)
              </option>
              <option value="invoices" style={{ background: '#fff', color: '#222' }}>
                invoices (Transactions & Billing)
              </option>
            </select>
            <button onClick={handleExportJson} style={{ ...topBtnStyle, background: '#28a745' }}>
              💾 Export JSON
            </button>
          </Panel>
        </ReactFlow>
      </div>

      {selectedNode && (
        <Sidebar
          node={selectedNode}
          onUpdate={handleUpdateNodeData}
          onDelete={handleDeleteNode}
          onAutowireDataClass={handleAutowireDataClass} // <-- Pass it here
          onAutowireZodSchema={handleAutowireZodSchema}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
