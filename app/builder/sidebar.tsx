import React from 'react';

interface SidebarProps {
  node: any;
  onUpdate: (id: string, newData: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function Sidebar({ node, onUpdate, onDelete, onClose }: SidebarProps) {
  const isUml = node.type === 'uml';
  const isDataClass = node.type === 'dataClass'; // Added check
  const data = node.data;

  // --- Styles ---
  const sidebarStyle: React.CSSProperties = {
    width: '320px',
    height: '100%',
    background: '#fff',
    borderLeft: '1px solid #ccc',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    fontFamily: 'sans-serif',
  };

  const inputStyle: React.CSSProperties = {
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

  // --- Common Handlers ---
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(node.id, { name: e.target.value });
  };

  const handleAttributeChange = (index: number, value: string) => {
    const updated = [...data.attributes];
    updated[index] = value;
    onUpdate(node.id, { attributes: updated });
  };

  const addAttribute = () => {
    onUpdate(node.id, { attributes: [...data.attributes, 'name: string'] });
  };

  const deleteAttribute = (index: number) => {
    const updated = data.attributes.filter((_: any, i: number) => i !== index);
    onUpdate(node.id, { attributes: updated });
  };

  // --- Methods Handlers ---
  const handleMethodChange = (index: number, value: string) => {
    const currentMethods = data.methods || [];
    const updated = [...currentMethods];
    updated[index] = value;
    onUpdate(node.id, { methods: updated });
  };

  const addMethod = () => {
    onUpdate(node.id, { methods: [...(data.methods || []), '+ newMethod(): void'] });
  };

  const deleteMethod = (index: number) => {
    const updated = (data.methods || []).filter((_: any, i: number) => i !== index);
    onUpdate(node.id, { methods: updated });
  };

  // --- DB Table Handlers ---
  const handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(node.id, { tableName: e.target.value });
  };

  const handleColumnChange = (index: number, key: string, value: any) => {
    const updated = [...data.columns];
    updated[index] = { ...updated[index], [key]: value };
    onUpdate(node.id, { columns: updated });
  };

  const addColumn = () => {
    onUpdate(node.id, {
      columns: [
        ...data.columns,
        { name: 'new_column', type: 'VARCHAR(255)', isPK: false, isFK: false },
      ],
    });
  };

  const deleteColumn = (index: number) => {
    const updated = data.columns.filter((_: any, i: number) => i !== index);
    onUpdate(node.id, { columns: updated });
  };

  return (
    <div style={sidebarStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>
          {isUml && 'UML Class Properties'}
          {isDataClass && 'Data Class Properties'}
          {node.type === 'dbTable' && 'DB Table Properties'}
        </h3>
        <button onClick={onClose} style={{ ...btnStyle, background: '#666' }}>
          Close
        </button>
      </div>

      {/* RENDER FOR UML CLASS OR DATA CLASS */}
      {isUml || isDataClass ? (
        <>
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              {isUml ? 'Class Name' : 'Type Name'}
            </label>
            <input style={inputStyle} value={data.name} onChange={handleNameChange} />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Properties</label>
              <button onClick={addAttribute} style={btnStyle}>
                + Add Field
              </button>
            </div>
            {data.attributes.map((attr: string, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <input
                  style={inputStyle}
                  value={attr}
                  onChange={(e) => handleAttributeChange(index, e.target.value)}
                />
                <button
                  onClick={() => deleteAttribute(index)}
                  style={{ ...btnStyle, background: '#cc0000', marginBottom: '8px' }}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* Render methods ONLY for UML Class */}
          {isUml && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Methods</label>
                <button onClick={addMethod} style={btnStyle}>
                  + Add Method
                </button>
              </div>
              {(data.methods || []).map((method: string, index: number) => (
                <div key={index} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <input
                    style={inputStyle}
                    value={method}
                    onChange={(e) => handleMethodChange(index, e.target.value)}
                  />
                  <button
                    onClick={() => deleteMethod(index)}
                    style={{ ...btnStyle, background: '#cc0000', marginBottom: '8px' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* RENDER FOR DB TABLE */
        <>
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Table Name
            </label>
            <input style={inputStyle} value={data.tableName} onChange={handleTableNameChange} />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Columns</label>
              <button onClick={addColumn} style={{ ...btnStyle, background: '#e28743' }}>
                + Add Column
              </button>
            </div>
            {data.columns.map((col: any, index: number) => (
              <div
                key={index}
                style={{
                  borderBottom: '1px solid #eee',
                  paddingBottom: '10px',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input
                    style={{ ...inputStyle, width: '50%' }}
                    value={col.name}
                    placeholder="column_name"
                    onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                  />
                  <input
                    style={{ ...inputStyle, width: '40%' }}
                    value={col.type}
                    placeholder="INT"
                    onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                  />
                  <button
                    onClick={() => deleteColumn(index)}
                    style={{ ...btnStyle, background: '#cc0000', height: '33px' }}
                  >
                    X
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '15px', fontSize: '11px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={col.isPK || false}
                      onChange={(e) => handleColumnChange(index, 'isPK', e.target.checked)}
                    />{' '}
                    Key (🔑 PK)
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={col.isFK || false}
                      onChange={(e) => handleColumnChange(index, 'isFK', e.target.checked)}
                    />{' '}
                    Relation (🔗 FK)
                  </label>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Node Button */}
      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <button
          onClick={() => onDelete(node.id)}
          style={{
            ...btnStyle,
            background: '#cc0000',
            width: '100%',
            padding: '10px',
            fontSize: '13px',
            fontWeight: 'bold',
          }}
        >
          {isUml && 'Delete Class'}
          {isDataClass && 'Delete Type'}
          {node.type === 'dbTable' && 'Delete Table'}
        </button>
      </div>
    </div>
  );
}
