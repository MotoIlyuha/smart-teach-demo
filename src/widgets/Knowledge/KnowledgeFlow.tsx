import {Background, BackgroundVariant, Panel, ReactFlow} from "@xyflow/react";
import {Splitter} from 'antd';
import KnowledgeTree from "./KnowledgeTree.tsx";

export default function KnowledgeFlow() {
  return (
    <ReactFlow
      style={{width: '100%', height: '100%'}}
    >
      <Panel position={'top-left'} style={{width: '100%'}}>
        <Splitter>
          <Splitter.Panel collapsible defaultSize={250} min={150}>
            <KnowledgeTree/>
          </Splitter.Panel>
          <Splitter.Panel>

          </Splitter.Panel>
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