import {useContext} from "react";
import {CourseContext} from "../../widgets/Course/CourseProvider.tsx";

export const useCourse = () => {
  return useContext(CourseContext);
};