import {useCallback, useMemo, useState} from "react";
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
import {v4 as uuidv4} from 'uuid';

const nodeTypes = {
  lesson: LessonNode,
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

  const [nodes, setNodes, onNodesChange] = useNodesState(initial_nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(trajectory?.edges || []);

  // useEffect(() => {
  //   if (activeCategory) {
  //     setNodes(initial_nodes || []);
  //   }
  // }, [activeCategory, initial_nodes, setNodes]);

  const onConnect = useCallback((connection: Connection) => {
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
    }).then(r => console.log(r));
  }, [activeCategory, course, setEdges, updateCourse]);

  return (
    <ReactFlow
      nodes={initial_nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      style={{width: '100%', height: '100%'}}
    >
      <Panel position={'top-left'}>
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