import {useShallow} from "zustand/react/shallow";
import {Button, Segmented} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {Task} from "../../../../../shared/types/CourseTypes.ts";
import {useCourse} from "../../../../../shared/hok/Course.ts";
import {useLayout} from "../../../../../shared/hok/Layout.ts";
import {useCourseStore} from "../../../../../shared/stores/courseStore.ts";
import {v4 as uuidv4} from 'uuid';

export const CreateTaskButton = () => {
  const {setCurrentTask} = useCourse();
  const {setTaskEditMode, setActiveTab} = useLayout();
  const {createTask} = useCourseStore(useShallow(state => ({
    createTask: state.createTask
  })));

  const newTask: Task = {
    id: uuidv4(),
    content: null,
    questions: [],
    knowledge: [],
    totalPoints: 0,
    isPublic: false
  }

  return (
    <Button
      type={'primary'}
      icon={<PlusOutlined/>}
      onClick={() => {
        createTask(newTask)
          .then(() => {
            setCurrentTask(newTask);
            setTaskEditMode(true);
            setActiveTab('task-edit');
          });
      }}>
      Добавить задание
    </Button>
  )
}

export const PublicSwitch = () => (
  <Segmented<string>
    size={'large'}
    defaultValue={'local'}
    options={[{label: 'Локальные', value: 'local'},
      {label: 'Публичные', value: 'public', disabled: true}]}
    onChange={(value) => {
      console.log(value);
    }}
  />
)