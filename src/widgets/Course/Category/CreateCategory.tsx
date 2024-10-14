import {Button, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";

export default function CreateCategory() {
  const {course, updateCourse} = useCourseStore(useShallow((state) => ({
    course: state.course,
    updateCourse: state.updateCourse
  })));

  const handleCreateCategory = () => {
    if (!course) return;
    updateCourse({
      ...course,
      categories: [...course.categories, {
        id: `category-${Date.now().toString()}`,
        title: '',
        lessons: [],
        learningTrajectory: {
          id: Date.now().toString(),
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