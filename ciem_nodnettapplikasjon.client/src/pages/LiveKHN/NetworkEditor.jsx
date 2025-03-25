import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: '1',
    position: { x: 250, y: 5 },
    data: { label: 'Krisehåndterings\nSentral' },
    type: 'default',
  },
  {
    id: '2',
    position: { x: 100, y: 100 },
    data: { label: 'Hovedrednings\n-sentralen' },
  },
  {
    id: '3',
    position: { x: 400, y: 100 },
    data: { label: 'Nødetatene' },
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'red', strokeWidth: 3 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'red', strokeWidth: 3 } }
];

export default function NetworkEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
