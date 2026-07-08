import React, { useState, useCallback } from 'react'; // Adjust path based on your folders
import { AppEdge, AppNode } from './builder';

interface RelationshipSidebarProps {
  edge: AppEdge;
  nodes: AppNode[]; // Pass node list to resolve parent/child table names dynamically
  onUpdate: (id: string, newData: any) => void;
  onDelete: (id: string) => void;
  onConvertToManyToMany: (edgeId: string) => void;
  onClose: () => void;
}

export default function RelationshipSidebar({
  edge,
  nodes,
  onUpdate,
  onDelete,
  onConvertToManyToMany,
  onClose,
}: RelationshipSidebarProps) {
  const [width, setWidth] = useState(320);

  // Drag-to-resize panel logic
  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      mouseDownEvent.preventDefault();
      const startWidth = width;
      const startX = mouseDownEvent.clientX;

      const doDrag = (mouseMoveEvent: MouseEvent) => {
        const deltaX = mouseMoveEvent.clientX - startX;
        const newWidth = Math.max(250, Math.min(800, startWidth - deltaX));
        setWidth(newWidth);
      };

      const stopDrag = () => {
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
      };

      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
    },
    [width]
  );

  // Resolve source and target table names to display beautifully in the header
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  const sourceTableName = sourceNode?.type === 'dbTable' ? sourceNode.data.tableName : 'Source';
  const targetTableName = targetNode?.type === 'dbTable' ? targetNode.data.tableName : 'Target';

  // --- Styles ---
  const sidebarStyle: React.CSSProperties = {
    width: `${width}px`,
    height: '100%',
    background: '#fff',
    borderLeft: '2px solid #e28743', // Orange border matching the line colors
    padding: '20px 20px 20px 25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    fontFamily: 'sans-serif',
    position: 'relative',
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    marginBottom: '8px',
  };

  const btnStyle: React.CSSProperties = {
    padding: '6px 12px',
    background: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
  };

  return (
    <div style={sidebarStyle}>
      {/* Resizer Handle */}
      <div
        onMouseDown={startResizing}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '6px',
          height: '100%',
          cursor: 'ew-resize',
          backgroundColor: 'transparent',
          transition: 'background-color 0.15s',
          zIndex: 100,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e28743')} // Highlights orange when hovered
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#e28743' }}>Relation Editor</h3>
        <button onClick={onClose} style={{ ...btnStyle, background: '#666' }}>
          Close
        </button>
      </div>

      {/* Visual Relationship Link Indicator */}
      <div
        style={{
          padding: '10px',
          background: '#ffeef0',
          border: '1px solid #ffd1d5',
          borderRadius: '6px',
          fontSize: '12px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{sourceTableName}</span>
        <span style={{ margin: '0 8px', color: '#e28743' }}>➔</span>
        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{targetTableName}</span>
      </div>

      {/* Relation Type Dropdown */}
      <div>
        <label
          style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}
        >
          Relationship Type
        </label>
        <select
          style={selectStyle}
          value={edge.data?.relationType || 'one-to-many'}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'many-to-many') {
              onConvertToManyToMany(edge.id);
            } else {
              onUpdate(edge.id, {
                data: { relationType: val },
                label: val === 'one-to-one' ? '1-to-1 (One-to-One)' : '1-to-N (One-to-Many)',
              });
            }
          }}
        >
          <option value="one-to-one">one-to-one (One-to-One)</option>
          <option value="one-to-many">one-to-many (One-to-Many)</option>
          <option value="many-to-many">many-to-many (Many-to-Many - Spawns Join Table)</option>
        </select>
      </div>

      {/* Dynamic Guideline Text */}
      <div
        style={{
          padding: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#64748b',
          lineHeight: '1.5',
        }}
      >
        {edge.data?.relationType === 'one-to-one' && (
          <p style={{ margin: 0 }}>
            💡 <b>1-to-1 Rule:</b> The generated Foreign Key (
            <code>{getSingularName(sourceTableName)}_id</code>) will have a <b>UNIQUE</b> constraint
            compiled in your Postgres schema, guaranteeing a strict 1-to-1 link.
          </p>
        )}
        {edge.data?.relationType === 'one-to-many' && (
          <p style={{ margin: 0 }}>
            💡 <b>1-to-Many Rule:</b> Adds a standard referencing column (
            <code>{getSingularName(sourceTableName)}_id</code>) inside the child{' '}
            <code>{targetTableName}</code> table pointing to the parent table ID.
          </p>
        )}
      </div>

      {/* Delete Connection Button */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <button
          onClick={() => onDelete(edge.id)}
          style={{
            ...btnStyle,
            background: '#cc0000',
            width: '100%',
            padding: '10px',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          Remove Connection
        </button>
      </div>
    </div>
  );
}

// Quick singular helper used for inline guidelines display
const getSingularName = (tableName: string) => {
  const name = tableName.toLowerCase();
  if (name.endsWith('ies')) return name.slice(0, -3) + 'y';
  if (name.endsWith('s')) return name.slice(0, -1);
  return name;
};
