import {Task} from "../../../../../shared/types/CourseTypes.ts";
import {Badge, Space, Typography} from "antd";

const TaskTitle = ({task}: {task: Task}) => (
  <Space align={'baseline'} style={{marginLeft: 8}}>
    <Typography.Title level={5}>Баллы: </Typography.Title>
    <Badge count={task.totalPoints} color={'green'}/>
  </Space>
)

export default TaskTitle;