import {useParams} from "react-router-dom";

export default function CoursePage() {
  const {course_id} = useParams();

  return (
    <div>
      <h1>Course Page {course_id}</h1>
    </div>
  )
}