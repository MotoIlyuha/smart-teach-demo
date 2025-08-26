import {Button, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import {v4 as uuidv4} from 'uuid';

export default function CreateCategory() {
  const {course, updateCourse} = useCourseStore(useShallow((state) => ({
    course: state.course,
    updateCourse: state.updateCourse
  })));

  const handleCreateCategory = () => {
    if (!course) return;
    const new_id = uuidv4();
    updateCourse({
      ...course,
      categories: [
        ...course.categories,
        {
          id: new_id,
          title: '',
          lessons: [],
          learningTrajectory: {
            nodes: [],
            edges: []
          },
        }]
    }).catch(() => message.error('Не удалось создать раздел!'));
  }

  return (
    <Button type={'primary'} icon={<PlusOutlined/>} onClick={handleCreateCategory}>
      Новый раздел
    </Button>
  )
}