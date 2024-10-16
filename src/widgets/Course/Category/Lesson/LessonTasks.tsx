import {useCourse} from "../../../../shared/hok/Course.ts";
import {Flex, Tooltip, Typography} from "antd";
import {typeIcon} from "../../../../shared/config/lessonTypeIcons.tsx";

export default function LessonTasks () {
  const {selectedLesson} = useCourse();

  return (
    <Flex gap={8} vertical style={{padding: 12, color: 'white'}}>
      <Typography.Title level={3}>{selectedLesson?.title}</Typography.Title>
      <Typography.Text type={'secondary'}>{typeIcon[selectedLesson?.type || 'default'].label}</Typography.Text>
      {selectedLesson?.knowledge &&
          <Tooltip title={selectedLesson.knowledge.description}>
            <Typography.Text>{selectedLesson.knowledge.name}</Typography.Text>
          </Tooltip>
      }
    </Flex>
  )
}