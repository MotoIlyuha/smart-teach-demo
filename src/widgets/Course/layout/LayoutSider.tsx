import { useCourse } from "../../../shared/hok/Course.ts";
import LessonTasks from "../Category/Lesson/LessonTasks.tsx";
import CourseInfo from "../components/CourseInfo.tsx";

export default function CourseLayoutSider() {
  const {selectedLesson} = useCourse();

  return (
    <>
      {selectedLesson?.id ? <LessonTasks/> : <CourseInfo/>}
    </>
  );
}