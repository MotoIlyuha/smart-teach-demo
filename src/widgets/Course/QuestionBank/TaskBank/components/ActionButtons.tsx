import {useState} from "react";
import {Checkbox, Divider, Flex, Popconfirm} from "antd";
import {DeleteAction, EditAction} from "@ant-design/pro-editor";
import {Task} from "../../../../../shared/types/CourseTypes.ts";
import {useCourseStore} from "../../../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import {useCourse} from "../../../../../shared/hok/Course.ts";

const ActionButtons = ({task}: {task: Task}) => {
  const {deleteTask} = useCourseStore(useShallow(state => ({
    deleteTask: state.deleteTask
  })));
  const {setContent} = useCourse();
  const [open, setOpen] = useState(false);

  return (
    <Flex gap={1} align={'center'}>
      <Checkbox checked={task.isPublic}>Публичный</Checkbox>
      <Divider type="vertical"/>
      <EditAction title="Редактировать" onClick={() => console.log('!!!EDIT!!!')}/>
      <Popconfirm
        title="Удалить задачу?"
        description="Вы уверены, что хотите удалить задачу?"
        onConfirm={() => deleteTask(task.id)}
        okText="Да"
        cancelText="Нет"
        open={open}
        onOpenChange={setOpen}
      >
        <DeleteAction title="Удалить" onClick={() => setOpen(true)} danger/>
      </Popconfirm>
    </Flex>
  )
}

export default ActionButtons;