import { Position } from '@xyflow/react';

export const getEdgeParams = (sourceNode, targetNode) => {
  const sx = sourceNode.internals.positionAbsolute.x + sourceNode.measured.width;
  const sy = sourceNode.internals.positionAbsolute.y + sourceNode.measured.height / 2;
  const tx = targetNode.internals.positionAbsolute.x;
  const ty = targetNode.internals.positionAbsolute.y + targetNode.measured.height / 2;
  return { sx, sy, tx, ty, sourcePos: Position.Right, targetPos: Position.Left };
};
