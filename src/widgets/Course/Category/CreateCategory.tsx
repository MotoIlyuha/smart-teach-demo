import {Button, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useCourseStore} from "../../../shared/stores/courseStore.ts";
import {useShallow} from "zustand/react/shallow";
import {Category} from "../../../shared/types/CourseTypes.ts";

export default function CreateCategory() {
  const {course, updateCourse} = useCourseStore(useShallow((state) => ({
    course: state.course,
    updateCourse: state.updateCourse
  })));

  const handleCreateCategory = () => {
    if (!course) return;
    updateCourse({
      ...course,
      categories: [...course.categories, {title: 'new'} as Category]
    }).catch(() => message.error('Не удалось создать раздел!'));
  }

  return (
    <Button type={'primary'} icon={<PlusOutlined/>} onClick={handleCreateCategory}>
      Новый раздел
    </Button>
  )
}