import {useState} from "react";
import {useShallow} from "zustand/react/shallow";
import {GrTest} from "react-icons/gr";
import {Checkbox, Divider, Flex, Popconfirm} from "antd";
import {ActionIcon, DeleteAction, EditAction} from "@ant-design/pro-editor";
import {Task} from "../../../../../shared/types/CourseTypes.ts";
import {useCourseStore} from "../../../../../shared/stores/courseStore.ts";
import {useCourse} from "../../../../../shared/hok/Course.ts";
import {useLayout} from "../../../../../shared/hok/Layout.ts";

const ActionButtons = ({task}: {task: Task}) => {
  const {deleteTask, updateTask} = useCourseStore(useShallow(state => ({
    deleteTask: state.deleteTask,
    updateTask: state.updateTask
  })));
  const {setCurrentTask, currentTask} = useCourse();
  const {setTaskEditMode, setActiveTab, setTaskTestMode} = useLayout();
  const [open, setOpen] = useState(false);

  return (
    <Flex gap={1} align={'center'}>
      <Checkbox
        title={'Если задание помечено как публичное, другие пользователи смогут использовать его в своих курсах'}
        checked={task.isPublic}
        onChange={(e) => {
          updateTask(task.id, {isPublic: e.target.checked}).then();
        }}
      >
        Публичный
      </Checkbox>
      <Divider type="vertical"/>
      <ActionIcon
        title="Протестировать задание"
        icon={<GrTest />}
        onClick={() => {
          setCurrentTask(task);
          setActiveTab('task-test');
          setTaskTestMode(true);
        }}
      />
      <EditAction
        title="Редактировать"
        onClick={() => {
          setCurrentTask(task);
          setTaskEditMode(true);
          setActiveTab('task-edit');
        }}/>
      <Popconfirm
        title="Удалить задачу?"
        description="Вы уверены, что хотите удалить задачу?"
        onConfirm={() => {
          deleteTask(task.id)
            .then(() => {
              if (currentTask?.id === task.id) {
                setCurrentTask(null);
                setActiveTab('task-bank');
              }
            });
        }}
        okText="Да"
        cancelText="Нет"
        open={open}
        onOpenChange={setOpen}
      >
        <DeleteAction title="Удалить" onClick={() => setOpen(true)}/>
      </Popconfirm>
    </Flex>
  )
}

export default ActionButtons;