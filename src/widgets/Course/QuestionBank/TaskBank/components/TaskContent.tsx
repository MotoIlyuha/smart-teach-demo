import PreviewKnowledge from "../../../../Knowledge/components/Preview/PreviewKnowledge.tsx";
import {Flex, Space, Typography} from "antd";
import {Task} from "../../../../../shared/types/CourseTypes.ts";
import TaskPreview from "./TaskPreview.tsx";

const TaskContent = ({task}: {task: Task}) => (

  <Space align={'baseline'} direction={'vertical'} style={{overflow: 'hidden'}} size={0}
         split={<div style={{borderBottom: '1px solid #00000033', width: '5000px'}}/>}>
    <Flex align={'stretch'} gap={8}
          style={{
            width: '5000px',
            paddingLeft: 20,
            paddingBottom: 8,
            background: 'rgba(164,216,255,0.3)'
          }}>
      <Typography.Text style={{
        fontSize: 14,
        fontWeight: 'bold',
        textWrap: 'nowrap'
      }}>Знания: </Typography.Text>
      <PreviewKnowledge knowledge={task.knowledge}/>
    </Flex>
    <div style={{padding: '1em 1em 0'}}>
      <TaskPreview task={task}/>
    </div>
  </Space>
)

export default TaskContent;