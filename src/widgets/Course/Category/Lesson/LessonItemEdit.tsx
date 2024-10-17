import {useEffect, useState} from "react";
import {Lesson, LessonType} from "../../../../shared/types/CourseTypes.ts";
import {Button, Flex, Popover, Tag, Tooltip, Typography} from "antd";
import {ActionGroup, ActionIcon, ActionIconGroupItemType, Input} from "@ant-design/pro-editor";
import {typeIcon} from "../../../../shared/config/lessonTypeIcons.tsx";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {useCourse} from "../../../../shared/hok/Course.ts";

interface LessonItemEditProps {
  lesson: Lesson;
  handleUpdate: (lesson: Lesson) => void;
  handleCancel: () => void;
}

export default function LessonItemEdit({lesson, handleUpdate, handleCancel}: LessonItemEditProps) {
  const {selectedKnowledge, setSelectedKnowledge} = useCourse();
  const [valid, setValid] = useState(lesson.title.length > 2 && lesson.title.length < 40);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [type, setType] = useState<LessonType>(lesson.type);

  useEffect(() => {
    console.log(selectedKnowledge);
  }, [selectedKnowledge]);

  const TypePicker = () => (
    <Popover overlayInnerStyle={{padding: 2}} open={open} content={
      <ActionGroup
        items={Object.entries(typeIcon).map(([key, value], index, array) => [
          {
            key: key,
            icon: value.icon,
            label: value.label,
            onClick: () => {
              setType(key as LessonType);
              setOpen(false);
            }
          } as ActionIconGroupItemType,
          ...(index < array.length - 1 ? [{type: 'divider'} as ActionIconGroupItemType] : [])
        ]).flat()}
      />
    }
    >
      <ActionIcon icon={typeIcon[type].icon} type={'text'} onClick={() => setOpen(!open)}/>
    </Popover>
  )

  return (
    <Flex gap={4} vertical style={{width: '100%'}}>
      <Flex gap={8} align={'baseline'}>
        <TypePicker/>
        <Input
          defaultValue={lesson.title}
          value={title}
          onValueChanging={(e) => {
            setTitle(e);
            if (e.length < 4 || e.length > 40) {
              setValid(false);
            } else {
              setValid(true);
            }
          }}
          status={valid ? '' : 'error'}
          placeholder={'Название урока'}
          style={{width: '100%'}}
        />
        <Button
          title={'Сохранить'}
          type={'text'}
          onClick={() => handleUpdate({...lesson, title, type})}
          icon={<CheckOutlined/>}
          style={{color: valid ? '#52c41a' : 'grey'}}
          disabled={!valid}
        />
        <Button
          title={'Отмена'}
          type={'text'}
          onClick={handleCancel}
          icon={<CloseOutlined/>}
          style={{color: 'red'}}
        />
      </Flex>
      {(type === 'default' || type === 'optional') && (
        <Flex gap={8} align={'baseline'} style={{paddingInline: 8}}>
          {selectedKnowledge ?
            <>
              <Typography.Text type={'secondary'}>Проверяемое знание: </Typography.Text>
              <Tooltip title={selectedKnowledge?.description || undefined}>
                <Tag color={'blue'} closable onClose={() => setSelectedKnowledge(undefined)}>
                  {selectedKnowledge.name}
                </Tag>
              </Tooltip>
            </>
            :
            <Typography.Text type={'secondary'}>Выберите знание из Дерева Знаний</Typography.Text>}
        </Flex>
      )}
    </Flex>
  );
}