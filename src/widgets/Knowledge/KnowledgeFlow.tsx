import {useState} from "react";
import {Background, BackgroundVariant, Panel, ReactFlow} from "@xyflow/react";
import {Button, Flex, Typography} from 'antd';
import KnowledgeTree from "./KnowledgeTree.tsx";
import {useCourse} from "../../shared/hok/Course.ts";
import {LessonNode} from "./LessonNode.tsx";
import {Lesson} from "../../shared/types/CourseTypes.ts";

const nodeTypes = {
  lesson: LessonNode,
};

export default function KnowledgeFlow() {
  const {activeCategory, selectMode} = useCourse();
  const [collapsed, setCollapsed] = useState(false);
  // const {course} = useCourseStore(useShallow((set) => ({
  //   course: set.course
  // })));
  const trajectory = activeCategory?.learningTrajectory;
  const nodes = trajectory?.nodes?.map(n => ({
    ...n,
    data: activeCategory?.lessons?.find(l => l.id === n.id) as Record<string, unknown> & Lesson
  }));

  console.log(trajectory, nodes);

  return (
    <ReactFlow
      nodes={nodes}
      edges={trajectory?.edges || []}
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