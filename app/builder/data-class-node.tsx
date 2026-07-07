import { Handle, Position } from '@xyflow/react';

interface DataClassNodeData {
  name: string;
  attributes: string[];
}

export default function DataClassNode({
  data,
  selected,
}: {
  data: DataClassNodeData;
  selected?: boolean;
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: selected ? '2px solid #008080' : '2px solid #004d4d', // Teal color theme
        borderRadius: '6px',
        minWidth: '180px',
        fontFamily: 'monospace',
        fontSize: '12px',
        boxShadow: selected
          ? '0 0 8px rgba(0, 128, 128, 0.5)'
          : '4px 4px 0px rgba(0, 77, 77, 0.15)',
        transition: 'border 0.15s, box-shadow 0.15s',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#004d4d' }} />

      {/* Header with document icon */}
      <div
        style={{
          padding: '8px',
          borderBottom: '2px solid #004d4d',
          textAlign: 'center',
          fontWeight: 'bold',
          background: selected ? '#e6f2f2' : '#cce6e6',
          borderRadius: '4px 4px 0 0',
        }}
      >
        📄 Type: {data.name || 'UnnamedType'}
      </div>

      {/* Attributes List */}
      <div style={{ padding: '8px', background: '#fff' }}>
        {data.attributes.map((attr, index) => (
          <div key={index} style={{ padding: '2px 0' }}>
            {attr}
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#004d4d' }} />
    </div>
  );
}
