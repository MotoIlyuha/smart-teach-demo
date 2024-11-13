import {useCallback, useEffect, useMemo, useState} from "react";
import {MarkerType} from "reactflow";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Edge,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import {Button, Flex, Typography} from 'antd';
import KnowledgeTree from "./KnowledgeTree.tsx";
import {useCourse} from "../../shared/hok/Course.ts";
import {LessonNode} from "./Node/LessonNode.tsx";
import {Lesson} from "../../shared/types/CourseTypes.ts";
import {useCourseStore} from "../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import FloatingEdge from "./Edge/FloatingEdge.tsx";
import {v4 as uuidv4} from 'uuid';
import ConnectionLine from "./Line/ConnectionLine.tsx";

const nodeTypes = {
  lesson: LessonNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black', opacity: 0.5 },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

const connectionLineStyle = {
  strokeWidth: 3,
  stroke: 'black',
};

export default function KnowledgeFlow() {
  const {activeCategory, selectMode} = useCourse();
  const [collapsed, setCollapsed] = useState(false);
  const {course, updateCourse} = useCourseStore(useShallow((set) => ({
    updateCourse: set.updateCourse,
    course: set.course
  })));
  const trajectory = activeCategory?.learningTrajectory;
  const initial_nodes = useMemo(() => (
    trajectory?.nodes?.map(n => ({
      ...n,
      type: 'lesson',
      data: activeCategory?.lessons?.find(l => l.id === n.lesson_id) as Record<string, unknown> & Lesson
    })) || []
  ), [trajectory, activeCategory]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initial_nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...trajectory?.edges || [], {
    id: 'floating-edge',
    source: "10792616-5690-4d73-abe5-8c9d472c45a2",
    target: "652df10f-05b3-4aa6-864d-fcb2cf5d880a",
    type: 'default',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'black',
    }}]);

  useEffect(() => {
    setNodes(initial_nodes);
  }, [initial_nodes, setNodes]);

  const onConnect = useCallback((connection: Connection) => {
    console.log(connection);
    const edge: Edge = { ...connection, id: uuidv4() };
    setEdges((eds) => addEdge(edge, eds));
    updateCourse({
      ...course,
      categories: course?.categories?.map(c => c.id === activeCategory?.id ? {
        ...c,
        learningTrajectory: {
          ...c.learningTrajectory,
          edges: [...c.learningTrajectory.edges, edge]
        }
      } : c)
    }).then();
  }, [activeCategory, course, setEdges, updateCourse]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      connectionLineComponent={ConnectionLine}
      fitView
      style={{width: '100%', height: '100%'}}
    >
      <Panel position={'top-left'} onClick={() => console.log(edges)}>
        <Flex gap={8} align={'baseline'}>
          <Typography.Title level={3}>
            {selectMode ? 'Выберите знание' : (activeCategory ? activeCategory.title : 'Дерево знаний')}
          </Typography.Title>
          {!selectMode &&
              <Button onClick={() => setCollapsed(!collapsed)}>{collapsed ? 'Развернуть' : 'Свернуть'}</Button>}
        </Flex>
        {(!collapsed || selectMode) && <KnowledgeTree/>}
      </Panel>
      <Background
        gap={12}
        variant={BackgroundVariant.Dots}
        color="#aaa"
      />
    </ReactFlow>
  )
}