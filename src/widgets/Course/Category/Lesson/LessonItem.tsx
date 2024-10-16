import {useState} from "react";
import {Flex, Tag, Typography} from "antd";
import {ActionIcon, DeleteAction, EditAction, HandleAction} from "@ant-design/pro-editor";
import {Lesson} from "../../../../shared/types/CourseTypes.ts";
import {typeIcon} from "../../../../shared/config/lessonTypeIcons.tsx";

interface LessonItemProps {
  index: number | undefined,
  listeners: Record<string, (param: never) => void> | undefined,
  lesson: Lesson,
  handleDelete: (index: number) => void
  handleEdit: () => void
}

const LessonItem = ({index, listeners, lesson, handleEdit, handleDelete}: LessonItemProps) => {
  const [hover, setHover] = useState(false);

  return (
    <Flex gap={4} vertical style={{width: '100%'}}>
      <Flex gap={8} align={'center'} style={{width: '100%'}}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {hover ?
          <HandleAction {...listeners}/>
          :
          <ActionIcon icon={typeIcon[lesson?.type || 'default'].icon} type={'text'}/>
        }
        <Typography.Text style={{width: '100%'}}>{lesson.title}</Typography.Text>
        <EditAction
          title={'Редактировать'}
          onClick={handleEdit}
          style={{opacity: hover ? 1 : 0}}
        />
        <DeleteAction
          title={'Удалить'}
          onClick={() => index !== undefined && handleDelete(index)}
          style={{opacity: hover ? 1 : 0}}
        />
      </Flex>
      <Flex gap={8} align={'baseline'} style={{paddingInline: 8}}>
        {lesson.knowledge ? (
          <>
            <Typography.Text type={'secondary'}>Проверяемое знание: </Typography.Text>
            <Tag>{lesson.knowledge}</Tag>
          </>
        ) : (
          <Typography.Text type={'secondary'}>Этот урок не проверяет знания</Typography.Text>
        )}
      </Flex>
    </Flex>
  )
}

export default LessonItem;