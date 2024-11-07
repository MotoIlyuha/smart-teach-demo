import {useContext} from "react";
import {CourseEditLayoutContext} from "../../widgets/Course/CourseEditLayoutProvider";

export const useLayout = () => {
  return useContext(CourseEditLayoutContext);
}