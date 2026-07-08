import { Handle, Position } from '@xyflow/react';

interface ZodField {
  name: string;
  validation: string;
}

interface ZodOperation {
  name: string;
  omitFields: string[];
}

interface ZodNodeData {
  name: string;
  fields: ZodField[];
  operations?: ZodOperation[];
}

export default function ZodNode({ data, selected }: { data: ZodNodeData; selected?: boolean }) {
  return (
    <div
      style={{
        background: '#fff',
        border: selected ? '2px solid #4f46e5' : '2px solid #312e81', // Indigo theme
        borderRadius: '6px',
        minWidth: '220px',
        fontFamily: 'monospace',
        fontSize: '11px',
        boxShadow: selected
          ? '0 0 8px rgba(79, 70, 229, 0.5)'
          : '4px 4px 0px rgba(49, 46, 129, 0.15)',
        transition: 'border 0.15s, box-shadow 0.15s',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#312e81' }} />

      {/* Header */}
      <div
        style={{
          padding: '8px',
          borderBottom: '2px solid #312e81',
          textAlign: 'center',
          fontWeight: 'bold',
          background: selected ? '#eef2ff' : '#e0e7ff',
          borderRadius: '4px 4px 0 0',
        }}
      >
        🛡️ Zod: {data.name || 'FormSchema'}
      </div>

      {/* Base Fields Section */}
      <div style={{ padding: '8px', borderBottom: '1px solid #ddd', background: '#fff' }}>
        <div style={{ fontWeight: 'bold', color: '#4f46e5', marginBottom: '4px', fontSize: '9px' }}>
          BASE OBJECT
        </div>
        {data.fields.map((field, index) => (
          <div
            key={index}
            style={{
              padding: '2px 0',
              overflowX: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{field.name}</span>:{' '}
            <span style={{ color: '#059669' }}>{field.validation || 'z.any()'}</span>
          </div>
        ))}
      </div>

      {/* Operations (Sub-schemas) Section */}
      {data.operations && data.operations.length > 0 && (
        <div style={{ padding: '8px', background: '#f8fafc' }}>
          <div
            style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px', fontSize: '9px' }}
          >
            GENERATED SUB-SCHEMAS
          </div>
          {data.operations.map((op, index) => (
            <div key={index} style={{ padding: '2px 0', fontSize: '10px' }}>
              ⚙️ <span style={{ fontWeight: 'bold' }}>{op.name}</span>
              {op.omitFields.length > 0 && (
                <span style={{ color: '#94a3b8' }}> (omits: {op.omitFields.join(', ')})</span>
              )}
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} style={{ background: '#312e81' }} />
    </div>
  );
}
