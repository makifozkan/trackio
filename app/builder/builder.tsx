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
import RelationshipSidebar from './relationship-sidebar';

// ==========================================
// 6. RELATIONSHIP (EDGE) CUSTOM CONTRACTS
// ==========================================
export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export type AppEdgeData = {
  relationType: RelationType;
};

// Strongly types the React Flow Edge generic payload!
export type AppEdge = Edge<AppEdgeData>;

// ==========================================
// 1. Column and Database Node Data Types (Converted to types)
// ==========================================
export type DbColumn = {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  isNotNull?: boolean;
  defaultValue?: string;
};

export type DbTableNodeData = {
  tableName: string;
  columns: DbColumn[];
};

// ==========================================
// 2. UML Node Data Types (Converted to types)
// ==========================================
export type UmlNodeData = {
  name: string;
  attributes: string[];
  methods: string[];
  stereotype?: 'interface' | 'abstract' | 'dataclass';
};

// ==========================================
// 3. Data Class Node Data Types (Converted to types)
// ==========================================
export type DataClassNodeData = {
  name: string;
  attributes: string[];
};

// ==========================================
// 4. Zod Schema Node Data Types (Converted to types)
// ==========================================
export type ZodField = {
  name: string;
  validation?: string;
};

export type ZodOperation = {
  name: string;
  omitFields: string[];
};

export type ZodSchemaNodeData = {
  name: string;
  fields: ZodField[];
  operations?: ZodOperation[];
};

// ==========================================
// 5. THE DISCRIMINATED UNION
// ==========================================
export type DbTableNode = Node<DbTableNodeData, 'dbTable'>;
export type UmlNode = Node<UmlNodeData, 'uml'>;
export type DataClassNode = Node<DataClassNodeData, 'dataClass'>;
export type ZodSchemaNode = Node<ZodSchemaNodeData, 'zodSchema'>;

// This represents ANY valid node on your canvas, fully typed!
export type AppNode = DbTableNode | UmlNode | DataClassNode | ZodSchemaNode;

const toPascalCase = (str: string) => {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(.)(\w*)/g, ($1, $2, $3) => $2.toUpperCase() + $3.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase());
};

function getPluralName(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith('y')) return lower.slice(0, -1) + 'ies'; // e.g. Category -> categories
  if (lower.endsWith('s')) return lower;
  return lower + 's'; // e.g. Product -> products
}

const getSingularName = (tableName: string) => {
  const name = tableName.toLowerCase();
  if (name.endsWith('ies')) return name.slice(0, -3) + 'y'; // e.g. categories -> category
  if (name.endsWith('s')) return name.slice(0, -1); // e.g. users -> user
  return name;
};

// 2. Map your custom "uml" node type to the UmlNode React Component.
// It is important to define this object OUTSIDE of your component to prevent re-renders.
const nodeTypes = {
  uml: UmlNode,
  dbTable: DbTableNode,
  dataClass: DataClassNode,
  zodSchema: ZodNode,
};

const initialNodes: AppNode[] = [
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
  const [nodes, setNodes] = useState<AppNode[]>(initialNodes);
  const [edges, setEdges] = useState<AppEdge[]>(initialEdges);

  // Track which node is currently selected
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) => {
      // 1. Append the new edge with a styled relationship label & closed arrow
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            label: '1-to-N (One-to-Many)', // Default relationship type
            style: { stroke: '#e28743', strokeWidth: 2 }, // Orange relationship line
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#e28743',
            },
            data: {
              relationType: 'one-to-many',
            },
          },
          eds
        )
      );

      // 2. Resolve nodes in state
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      // 3. Automated Foreign Key Injection Logic
      if (
        sourceNode &&
        targetNode &&
        sourceNode.type === 'dbTable' &&
        targetNode.type === 'dbTable'
      ) {
        const parentTableName = sourceNode.data.tableName;
        const singularParentName = getSingularName(parentTableName);
        const fkColumnName = `${singularParentName}_id`; // e.g. "user_id"

        // Find the Primary Key of the parent to match the data type
        const parentPk = sourceNode.data.columns.find((col: any) => col.isPK);
        const parentPkType = parentPk ? parentPk.type.toUpperCase() : 'INT';

        // Map SERIAL -> INT (A referencing column cannot be auto-increment SERIAL)
        const fkDataType = parentPkType === 'SERIAL' ? 'INT' : parentPkType;

        // Check if the target child table already has this column
        const targetColumns = targetNode.data.columns || [];
        const alreadyHasFk = targetColumns.some((col: any) => col.name === fkColumnName);

        if (!alreadyHasFk) {
          // Inject the new foreign key column into the target child node
          setNodes((currentNodes) =>
            currentNodes.map((node) => {
              if (node.id === targetNode.id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    columns: [
                      ...(node.data as DbTableNodeData).columns,
                      {
                        name: fkColumnName,
                        type: fkDataType,
                        isFK: true, // Marked as Foreign Key
                        isNotNull: false,
                        defaultValue: '',
                      },
                    ],
                  },
                } as DbTableNode;
              }
              return node;
            })
          );
        }
      }
    },
    [nodes, setEdges, setNodes] // Ensure 'nodes' is in dependency array to read latest column values!
  );

  // 1. Capture when a node is clicked
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNodeId(node.id);
  }, []);

  // Capture when user clicks an Edge line
  const onEdgeClick = useCallback((event: any, edge: any) => {
    setSelectedNodeId(null); // Clear node selection
    setSelectedEdgeId(edge.id); // Set active edge
  }, []);

  // Update onPaneClick to clear both
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
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

    const newNode: UmlNode = {
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
    if (!tableName || !columns) return;

    const pascalName = toPascalCase(tableName);

    // 1. Compile SQL Columns into precise Zod validation strings
    const mappedFields = columns.map((col: any) => {
      const sqlType = col.type.toUpperCase();
      const isRequired = col.isPK || col.isNotNull;
      const isAuto = sqlType === 'SERIAL' || (col.defaultValue && col.defaultValue.trim() !== '');

      let zodStr = 'z.string()'; // Default fallback

      // =========================================================================
      // RULE 1: If it's auto-generated, keep it simple and optional (no input prompt error strings)
      // =========================================================================
      if (isAuto) {
        if (
          sqlType.includes('INT') ||
          sqlType === 'SERIAL' ||
          sqlType.includes('DECIMAL') ||
          sqlType.includes('BIGINT')
        ) {
          zodStr = 'z.coerce.number().optional()';
        } else if (sqlType.includes('BOOL')) {
          zodStr = 'z.boolean().optional()';
        } else {
          zodStr = 'z.string().optional()';
        }
        return { name: col.name, validation: zodStr };
      }

      // =========================================================================
      // RULE 2: If it is standard user-editable, build rich custom validations
      // =========================================================================
      if (sqlType.includes('INT') || sqlType.includes('DECIMAL') || sqlType.includes('BIGINT')) {
        zodStr = isRequired
          ? `z.coerce.number({ invalid_type_error: 'Please enter a valid number for ${col.name.replace(/_/g, ' ')}.' })`
          : 'z.coerce.number()';
      } else if (sqlType.includes('BOOL')) {
        zodStr = 'z.boolean()';
      } else if (col.name.toLowerCase().includes('email')) {
        zodStr = isRequired
          ? `z.string({ required_error: 'Please enter your email.' }).email({ message: 'Invalid email address.' })`
          : 'z.string().email().optional()';
        return { name: col.name, validation: zodStr };
      }

      // Add nullability constraints
      if (!isRequired) {
        zodStr += '.nullable().optional()';
      } else if (zodStr === 'z.string()') {
        zodStr = `z.string({ required_error: '${col.name.replace(/_/g, ' ')} is required.' })`;
      }

      return {
        name: col.name,
        validation: zodStr,
      };
    });

    // 2. Identify fields to omit dynamically
    const autoGeneratedFields = columns
      .filter((col: any) => {
        const sqlType = col.type.toUpperCase();
        const hasDefault = col.defaultValue && col.defaultValue.trim() !== '';
        return sqlType === 'SERIAL' || hasDefault;
      })
      .map((col: any) => col.name);

    const primaryKeys = columns.filter((col: any) => col.isPK).map((col: any) => col.name);

    const id = `zod-node-${Date.now()}`;

    // 3. Create the node
    const newZodSchemaNode: ZodSchemaNode = {
      id,
      type: 'zodSchema',
      position: {
        x: tableNode.position.x + 350,
        y: tableNode.position.y + 100,
      },
      data: {
        name: `${pascalName}Schema`,
        fields: mappedFields,
        operations: [
          {
            name: `Create${pascalName}`,
            omitFields: autoGeneratedFields,
          },
          {
            name: `Update${pascalName}`,
            omitFields: primaryKeys,
          },
        ],
      },
    };

    setNodes((nds) => [...nds, newZodSchemaNode]);
    setSelectedNodeId(id);
  };

  const handleAutowireDataClass = (tableNode: AppNode) => {
    // 1. Safe Type Guard: Enforce that we are starting from a database table node
    if (tableNode.type !== 'dbTable') return;

    const { tableName, columns } = tableNode.data;
    if (!tableName || !columns) return;

    const pascalName = toPascalCase(tableName);

    // 2. Map standard database columns to TS types
    const mappedAttributes = columns.map((col) => {
      let tsType = 'string';
      const type = col.type.toUpperCase();

      if (
        type.includes('INT') ||
        type.includes('SERIAL') ||
        type.includes('DECIMAL') ||
        type.includes('BIGINT')
      ) {
        tsType = 'number';
      } else if (type.includes('BOOL')) {
        tsType = 'boolean';
      }

      const isNullable = !col.isPK && !col.isNotNull;
      const optionalFlag = isNullable ? '?' : '';

      return `${col.name}${optionalFlag}: ${tsType}`;
    });

    // =========================================================================
    // 3. SCAN RELATIONSHIPS (EDGES) WITH ROBUST LABEL FALLBACKS
    // =========================================================================
    const relationalAttributes: string[] = [];

    edges.forEach((edge) => {
      // SMART FALLBACK: If edge.data is missing, evaluate visual label string to support pre-existing edges
      const relation = edge.data?.relationType;

      // A. Outgoing Relationship (Current table is Parent / Source)
      if (edge.source === tableNode.id) {
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (targetNode && targetNode.type === 'dbTable') {
          const childTableName = targetNode.data.tableName;
          const childPascalName = toPascalCase(childTableName); // e.g. "Products"

          if (relation === 'one-to-many') {
            const childPropertyPlural = getPluralName(childPascalName).toLowerCase();
            relationalAttributes.push(`${childPropertyPlural}?: ${childPascalName}[]`);
          } else if (relation === 'one-to-one') {
            const childPropertySingular = getSingularName(childPascalName).toLowerCase();
            relationalAttributes.push(`${childPropertySingular}?: ${childPascalName}`);
          }
        }
      }

      // B. Incoming Relationship (Current table is Child / Target)
      if (edge.target === tableNode.id) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode && sourceNode.type === 'dbTable') {
          const parentTableName = sourceNode.data.tableName;
          const parentPascalName = toPascalCase(parentTableName); // e.g. "UsersV2"

          const parentPropertySingular = getSingularName(parentPascalName).toLowerCase();
          relationalAttributes.push(`${parentPropertySingular}?: ${parentPascalName}`);
        }
      }
    });

    const id = `dataclass-node-${Date.now()}`;

    // Combine standard properties with relations
    const finalAttributes = [...mappedAttributes, ...relationalAttributes];

    // 4. Create the final strongly-typed Data Class Node
    const newDataClassNode: AppNode = {
      id,
      type: 'dataClass',
      position: {
        x: tableNode.position.x + 350,
        y: tableNode.position.y,
      },
      data: {
        name: pascalName,
        attributes: finalAttributes,
      },
    };

    setNodes((nds) => [...nds, newDataClassNode]);
    setSelectedNodeId(id);
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

  // =========================================================================
  // THE MAGIC CONVERTER: Turns a 1:N line into an N:M Junction Table instantly
  // =========================================================================
  const handleConvertToManyToMany = useCallback(
    (edgeId: string) => {
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return;

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (sourceNode?.type === 'dbTable' && targetNode?.type === 'dbTable') {
        const sourceName = sourceNode.data.tableName;
        const targetName = targetNode.data.tableName;

        // 1. Generate clean Junction table structures (e.g. users_projects)
        const junctionTableName = `${sourceName}_${targetName}`;
        const junctionNodeId = `db-node-junction-${Date.now()}`;

        // Get primary key details from both tables
        const sourcePk = sourceNode.data.columns.find((col) => col.isPK);
        const targetPk = targetNode.data.columns.find((col) => col.isPK);

        const sourcePkType = sourcePk ? sourcePk.type.toUpperCase() : 'INT';
        const targetPkType = targetPk ? targetPk.type.toUpperCase() : 'INT';

        const sourceSingular = getSingularName(sourceName);
        const targetSingular = getSingularName(targetName);

        // 2. Set up the junction table columns (Both are foreign keys AND make up a composite Primary Key)
        const junctionColumns = [
          {
            name: `${sourceSingular}_id`,
            type: sourcePkType === 'SERIAL' ? 'INT' : sourcePkType,
            isPK: true,
            isFK: true,
          },
          {
            name: `${targetSingular}_id`,
            type: targetPkType === 'SERIAL' ? 'INT' : targetPkType,
            isPK: true,
            isFK: true,
          },
        ];

        const junctionNodePosition = {
          x: (sourceNode.position.x + targetNode.position.x) / 2, // Placed exactly in the geometric middle!
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        };

        const newJunctionNode: AppNode = {
          id: junctionNodeId,
          type: 'dbTable',
          position: junctionNodePosition,
          data: {
            tableName: junctionTableName,
            columns: junctionColumns,
          },
        };

        // 3. Remove the old direct edge and draw two new arrows pointing to the junction table!
        setEdges((currentEdges) => {
          const filtered = currentEdges.filter((e) => e.id !== edgeId);
          return [
            ...filtered,
            {
              id: `edge-junc-1-${Date.now()}`,
              source: sourceNode.id,
              target: junctionNodeId,
              label: '1-to-N (One-to-Many)',
              style: { stroke: '#e28743', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#e28743' },
            },
            {
              id: `edge-junc-2-${Date.now()}`,
              source: targetNode.id,
              target: junctionNodeId,
              label: '1-to-N (One-to-Many)',
              style: { stroke: '#e28743', strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#e28743' },
            },
          ];
        });

        // 4. Inject Junction node, and revert the target table's single FK (clean up user_id from projects)
        setNodes((currentNodes) => {
          const filteredNodes = currentNodes.map((node) => {
            if (node.id === targetNode.id && node.type === 'dbTable') {
              // Remove the direct FK column (since we are switching to join table)
              const cleanColumns = node.data.columns.filter(
                (col) => col.name !== `${sourceSingular}_id`
              );
              return { ...node, data: { ...node.data, columns: cleanColumns } };
            }
            return node;
          });
          return [...filteredNodes, newJunctionNode];
        });

        setSelectedEdgeId(null); // Close sidebar
      }
    },
    [edges, nodes, setEdges, setNodes]
  );

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
          onEdgeClick={onEdgeClick}
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
              <option value="users_v2" style={{ background: '#fff', color: '#222' }}>
                users v2
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

      {selectedEdgeId && (
        <RelationshipSidebar
          edge={edges.find((e) => e.id === selectedEdgeId)!}
          nodes={nodes} // Pass full list to let the editor show "users" -> "products" nicely
          onUpdate={(id, newData) => {
            setEdges((eds) => eds.map((e) => (e.id === id ? { ...e, ...newData } : e)));
          }}
          onDelete={(id) => {
            setEdges((eds) => eds.filter((e) => e.id !== id));
            setSelectedEdgeId(null); // Close panel
          }}
          onConvertToManyToMany={handleConvertToManyToMany}
          onClose={() => setSelectedEdgeId(null)}
        />
      )}
    </div>
  );
}
