import {Background, BackgroundVariant, Panel, ReactFlow} from "@xyflow/react";
import {Button, Flex, Typography} from 'antd';
import KnowledgeTree from "./KnowledgeTree.tsx";
import {useState} from "react";
import {useCourse} from "../../shared/hok/Course.ts";

export default function KnowledgeFlow() {
  const {activeCategory, selectMode} = useCourse();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ReactFlow
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
        {collapsed && !selectMode && <KnowledgeTree/>}
      </Panel>
      <Background
        gap={12}
        variant={BackgroundVariant.Dots}
        color="#aaa"
      />
    </ReactFlow>
  )
}