'use client';

import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UmlNode from './uml-node';
import Sidebar from './sidebar';
import DbTableNode from './db-table-node';
import DataClassNode from './data-class-node';
import { DATA_CLASS_PRESETS } from './presets';

// 2. Map your custom "uml" node type to the UmlNode React Component.
// It is important to define this object OUTSIDE of your component to prevent re-renders.
const nodeTypes = {
  uml: UmlNode,
  dbTable: DbTableNode,
  dataClass: DataClassNode,
};

const initialNodes = [
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

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function Builder() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
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
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}
