import {Edge, getStraightPath, useInternalNode} from '@xyflow/react';
import { getEdgeParams } from '../../../shared/utils/floatingEdgeUtils';
import './style.css';

function FloatingEdge({ id, source, target, style }: Edge) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd="url(#arrow)"
      style={style}
    />
  );
}

export default FloatingEdge;