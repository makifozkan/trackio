import { Handle, Position } from '@xyflow/react';

interface Column {
  name: string;
  type: string;
  isPK?: boolean;
  isFK?: boolean;
  isNotNull?: boolean;
}

interface DbTableNodeData {
  tableName: string;
  columns: Column[];
}

export default function DbTableNode({
  data,
  selected,
}: {
  data: DbTableNodeData;
  selected?: boolean;
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: selected ? '2px solid #e28743' : '2px solid #763b00', // Orange border for DB tables
        borderRadius: '6px',
        minWidth: '200px',
        fontFamily: 'Courier New, monospace',
        fontSize: '12px',
        boxShadow: selected
          ? '0 0 8px rgba(226, 135, 67, 0.5)'
          : '4px 4px 0px rgba(118, 59, 0, 0.15)',
        transition: 'border 0.15s, box-shadow 0.15s',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#763b00' }} />

      {/* Header with Table Emoji */}
      <div
        style={{
          padding: '8px',
          borderBottom: '2px solid #763b00',
          textAlign: 'center',
          fontWeight: 'bold',
          background: selected ? '#ffe9db' : '#f5e3d7', // Light orange header
          borderRadius: '4px 4px 0 0',
        }}
      >
        🗄️ {data.tableName || 'new_table'}
      </div>

      {/* Columns List */}
      <div style={{ padding: '6px 8px' }}>
        {data.columns.map((col, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              borderBottom: index < data.columns.length - 1 ? '1px dashed #eee' : 'none',
            }}
          >
            {/* Key Indicators + Name */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {col.isPK && <span title="Primary Key">🔑</span>}
              {col.isFK && <span title="Foreign Key">🔗</span>}
              <span style={{ fontWeight: col.isPK ? 'bold' : 'normal' }}>
                {col.name}
                {/* Visual indicator for NOT NULL columns */}
                {(col.isPK || col.isNotNull) && (
                  <span
                    style={{ color: '#cc0000', marginLeft: '2px', fontWeight: 'bold' }}
                    title="Not Null"
                  >
                    *
                  </span>
                )}
              </span>
            </div>

            {/* SQL Data Type */}
            <div style={{ color: '#666', fontStyle: 'italic' }}>{col.type}</div>
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#763b00' }} />
    </div>
  );
}
