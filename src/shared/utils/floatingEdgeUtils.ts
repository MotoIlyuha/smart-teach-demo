import { Position, MarkerType, Node } from 'reactflow';

// Define the helper function to find the intersection point between nodes
function getNodeIntersection(intersectionNode: Node, targetNode: Node) {
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } = intersectionNode.data?.measured || { width: 0, height: 0 };
  const intersectionNodePosition = intersectionNode.positionAbsolute || { x: 0, y: 0 };
  const targetPosition = targetNode.positionAbsolute || { x: 0, y: 0 };

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + (targetNode.data?.measured?.width || 0) / 2;
  const y1 = targetPosition.y + (targetNode.data?.measured?.height || 0) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// Determines the edge position (top, right, bottom, or left) for the node
function getEdgePosition(node: Node, intersectionPoint: { x: number; y: number }) {
  const n = node.positionAbsolute || { x: 0, y: 0 };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (node.data?.measured?.width || 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= ny + (node.data?.measured?.height || 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// Function to get edge parameters for creating edges
export function getEdgeParams(source: Node, target: Node) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

// Function to create nodes and edges
export function createNodesAndEdges() {
  const nodes: Node[] = [];
  const edges = [];
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  nodes.push({ id: 'target', data: { label: 'Target' }, position: center, type: 'default' });

  for (let i = 0; i < 8; i++) {
    const degrees = i * (360 / 8);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    nodes.push({ id: `${i}`, data: { label: 'Source' }, position: { x, y }, type: 'default' });

    edges.push({
      id: `edge-${i}`,
      target: 'target',
      source: `${i}`,
      type: 'floating',
      markerEnd: {
        type: MarkerType.Arrow,
      },
    });
  }

  return { nodes, edges };
}
