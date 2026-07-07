import { ReactFlowProvider } from '@xyflow/react';
import Builder from './builder';

export default async function Page() {
  return (
    <ReactFlowProvider>
      <Builder></Builder>
    </ReactFlowProvider>
  );
}
