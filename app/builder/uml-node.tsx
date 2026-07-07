import { Handle, Position } from '@xyflow/react';

// Define the shape of our data attribute
interface UmlNodeData {
  name: string;
  stereotype?: 'interface' | 'abstract' | 'dataclass';
  attributes: string[];
  methods?: string[];
}

export default function UmlNode({ data }: { data: UmlNodeData }) {
  return (
    <div
      style={{
        background: '#f9f9f9',
        border: '2px solid #222',
        borderRadius: '4px',
        minWidth: '180px',
        fontFamily: 'monospace',
        fontSize: '12px',
        boxShadow: '4px 4px 0px rgba(0,0,0,0.15)',
      }}
    >
      {/* 
        This Handle allows incoming connections to attach to the top of the node.
      */}
      <Handle type="target" position={Position.Top} style={{ background: '#222' }} />

      {/* Section 1: Header / Title */}
      <div
        style={{
          padding: '8px',
          borderBottom: '2px solid #222',
          textAlign: 'center',
          fontWeight: 'bold',
          background: '#eaeaea',
        }}
      >
        {data.stereotype && (
          <div style={{ fontSize: '10px', fontWeight: 'normal', fontStyle: 'italic' }}>
            &lt;&lt;{data.stereotype}&gt;&gt;
          </div>
        )}
        {data.name}
      </div>

      {/* Section 2: Attributes / Fields */}
      <div
        style={{
          padding: '8px',
          borderBottom: data.methods ? '2px solid #222' : 'none',
          textAlign: 'left',
          background: '#fff',
        }}
      >
        {data.attributes.map((attr, index) => (
          <div key={index} style={{ padding: '2px 0' }}>
            {attr}
          </div>
        ))}
      </div>

      {/* Section 3: Methods / Operations (Optional) */}
      {data.methods && data.methods.length > 0 && (
        <div style={{ padding: '8px', textAlign: 'left', background: '#fff' }}>
          {data.methods.map((method, index) => (
            <div key={index} style={{ padding: '2px 0' }}>
              {method}
            </div>
          ))}
        </div>
      )}

      {/* 
        This Handle allows outgoing connections to start from the bottom of the node.
      */}
      <Handle type="source" position={Position.Bottom} style={{ background: '#222' }} />
    </div>
  );
}
