import {Background, BackgroundVariant, Panel, ReactFlow} from "@xyflow/react";
import {Button, Flex, Splitter, Typography} from 'antd';
import KnowledgeTree from "./KnowledgeTree.tsx";
import {useState} from "react";
import {useCourse} from "../../shared/hok/Course.ts";

export default function KnowledgeFlow() {
  const {activeCategory} = useCourse();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ReactFlow
      style={{width: '100%', height: '100%'}}
    >
      <Panel position={'top-left'} style={{width: '100%'}}>
        <Flex gap={8} align={'baseline'}>
          <Typography.Title level={3}>{activeCategory ? activeCategory.title : 'Дерево знаний'}</Typography.Title>
          <Button onClick={() => setCollapsed(!collapsed)}>{collapsed ? 'Развернуть' : 'Свернуть'}</Button>
        </Flex>

        <Splitter>
          <Splitter.Panel collapsible defaultSize={200} size={collapsed ? 0 : 200}>
            <KnowledgeTree/>
          </Splitter.Panel>
          <Splitter.Panel/>
        </Splitter>
      </Panel>
      <Background
        gap={12}
        variant={BackgroundVariant.Dots}
        color="#aaa"
      />
    </ReactFlow>
  )
}