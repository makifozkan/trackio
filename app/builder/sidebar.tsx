import React from 'react';

interface SidebarProps {
  node: any;
  onUpdate: (id: string, newData: any) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  onAutowireDataClass?: (node: any) => void;
  onAutowireZodSchema?: (node: any) => void;
}

export default function Sidebar({
  node,
  onUpdate,
  onDelete,
  onClose,
  onAutowireDataClass,
  onAutowireZodSchema,
}: SidebarProps) {
  const isUml = node.type === 'uml';
  const isDataClass = node.type === 'dataClass'; // Added check
  const isDbTable = node.type === 'dbTable'; // Added check
  const isZod = node.type === 'zodSchema';
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

  // Zod Schema Specific Event Handlers
  // ==========================================
  const handleZodFieldNameChange = (index: number, val: string) => {
    const updated = [...data.fields];
    updated[index] = { ...updated[index], name: val };
    onUpdate(node.id, { fields: updated });
  };

  const handleZodFieldValidationChange = (index: number, val: string) => {
    const updated = [...data.fields];
    updated[index] = { ...updated[index], validation: val };
    onUpdate(node.id, { fields: updated });
  };

  const addZodField = () => {
    onUpdate(node.id, {
      fields: [...data.fields, { name: 'newField', validation: 'z.string()' }],
    });
  };

  const deleteZodField = (index: number) => {
    const updated = data.fields.filter((_: any, i: number) => i !== index);
    onUpdate(node.id, { fields: updated });
  };

  // Sub-schema Operations Handlers
  const addZodOperation = () => {
    const currentOps = data.operations || [];
    onUpdate(node.id, {
      operations: [...currentOps, { name: 'CreateSchema', omitFields: [] }],
    });
  };

  const deleteZodOperation = (index: number) => {
    const currentOps = data.operations || [];
    const updated = currentOps.filter((_: any, i: number) => i !== index);
    onUpdate(node.id, { operations: updated });
  };

  const handleOperationNameChange = (index: number, val: string) => {
    const currentOps = [...(data.operations || [])];
    currentOps[index] = { ...currentOps[index], name: val };
    onUpdate(node.id, { operations: currentOps });
  };

  const handleToggleOmitField = (opIndex: number, fieldName: string, isChecked: boolean) => {
    const currentOps = [...(data.operations || [])];
    const op = currentOps[opIndex];

    let updatedOmitFields;
    if (isChecked) {
      // If checked, add field to omit list
      updatedOmitFields = [...op.omitFields, fieldName];
    } else {
      // If unchecked, remove field from omit list
      updatedOmitFields = op.omitFields.filter((f: string) => f !== fieldName);
    }

    currentOps[opIndex] = { ...op, omitFields: updatedOmitFields };
    onUpdate(node.id, { operations: currentOps });
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
      {isUml ||
        (isDataClass && (
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
        ))}

      {isDbTable && (
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
          {/* DB Table Autowire Actions */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px' }}
          >
            {/* 1. Autowire Data Class */}
            <button
              onClick={() => onAutowireDataClass?.(node)}
              style={{
                ...btnStyle,
                background: '#008080',
                width: '100%',
                padding: '10px',
                fontWeight: 'bold',
                fontSize: '11px',
                marginBottom: 0,
              }}
            >
              🔌 Autowire Data Class (Type)
            </button>

            {/* 2. ADDED: Autowire Zod Schema */}
            <button
              onClick={() => onAutowireZodSchema?.(node)}
              style={{
                ...btnStyle,
                background: '#4f46e5', // Indigo color matching the Zod theme
                width: '100%',
                padding: '10px',
                fontWeight: 'bold',
                fontSize: '11px',
                marginBottom: 0,
              }}
            >
              🛡️ Autowire Zod Schema (Validator)
            </button>
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
                  <select
                    style={{ ...inputStyle, width: '40%' }}
                    value={col.type || 'VARCHAR(255)'} // Default to VARCHAR(255) if empty
                    onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
                  >
                    <option value="SERIAL">SERIAL (Auto-ID)</option>
                    <option value="INT">INT</option>
                    <option value="BIGINT">BIGINT</option>
                    <option value="VARCHAR(255)">VARCHAR(255)</option>
                    <option value="TEXT">TEXT</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                    <option value="DATE">DATE</option>
                    <option value="TIMESTAMP">TIMESTAMP</option>
                    <option value="TIMESTAMPTZ">TIMESTAMPTZ (with TZ)</option>
                    <option value="UUID">UUID</option>
                    <option value="DECIMAL">DECIMAL</option>
                  </select>
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

      {/* 4. CONDITIONAL RENDER: ZOD SCHEMA PANEL */}
      {isZod && (
        <>
          {/* Base Schema Name */}
          <div>
            <label
              style={{
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Base Schema Name
            </label>
            <input style={inputStyle} value={data.name} onChange={handleNameChange} />
          </div>

          {/* Base Object Fields */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Schema Fields</label>
              <button onClick={addZodField} style={{ ...btnStyle, background: '#4f46e5' }}>
                + Add Field
              </button>
            </div>
            {data.fields.map((field: any, index: number) => (
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
                    style={{ ...inputStyle, width: '40%' }}
                    value={field.name}
                    placeholder="field_name"
                    onChange={(e) => handleZodFieldNameChange(index, e.target.value)}
                  />
                  <input
                    style={{ ...inputStyle, width: '50%' }}
                    value={field.validation}
                    placeholder="z.string()"
                    onChange={(e) => handleZodFieldValidationChange(index, e.target.value)}
                  />
                  <button
                    onClick={() => deleteZodField(index)}
                    style={{ ...btnStyle, background: '#cc0000', height: '33px' }}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sub-schema Operations (Select Omit Fields) */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <label style={{ fontSize: '11px', fontWeight: 'bold' }}>
                Sub-Schemas (Omit Editor)
              </label>
              <button onClick={addZodOperation} style={{ ...btnStyle, background: '#4f46e5' }}>
                + Add Sub-Schema
              </button>
            </div>
            {(data.operations || []).map((op: any, opIndex: number) => (
              <div
                key={opIndex}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '10px',
                  background: '#f8fafc',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '5px',
                    marginBottom: '8px',
                  }}
                >
                  <input
                    style={{ ...inputStyle, marginBottom: 0 }}
                    value={op.name}
                    placeholder="CreateInvoiceSchema"
                    onChange={(e) => handleOperationNameChange(opIndex, e.target.value)}
                  />
                  <button
                    onClick={() => deleteZodOperation(opIndex)}
                    style={{ ...btnStyle, background: '#cc0000' }}
                  >
                    X
                  </button>
                </div>

                {/* Checkbox Grid for Omit Fields */}
                <div style={{ fontSize: '11px' }}>
                  <div style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>
                    Select Fields to Omit:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {data.fields.map((field: any, fIndex: number) => {
                      const isOmitted = op.omitFields.includes(field.name);
                      return (
                        <label
                          key={fIndex}
                          style={{
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isOmitted}
                            onChange={(e) =>
                              handleToggleOmitField(opIndex, field.name, e.target.checked)
                            }
                          />
                          <span
                            style={{
                              textDecoration: isOmitted ? 'line-through' : 'none',
                              color: isOmitted ? '#94a3b8' : '#222',
                            }}
                          >
                            {field.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
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
          {isZod && 'Delete Schema'}
          {node.type === 'dbTable' && 'Delete Table'}
        </button>
      </div>
    </div>
  );
}
