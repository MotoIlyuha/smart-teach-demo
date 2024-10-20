import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {Alert} from 'antd';

import {useShallow} from "zustand/react/shallow";
import {useCourseStore} from "../../shared/stores/courseStore.ts";

import {CourseProvider} from "../../widgets/Course/CourseProvider.tsx";
import {LayoutProvider} from "../../widgets/Course/CourseEditLayoutProvider.tsx";

import CourseEdit from "../../widgets/Course/CourseEdit.tsx";

export default function CourseEditPage() {
  const {course_id} = useParams();
  const navigate = useNavigate();
  const {course, fetchCourse, fetchTasks, loading, error} = useCourseStore(useShallow(state => ({
    course: state.course,
    fetchCourse: state.fetchCourse,
    fetchTasks: state.fetchTasks,
    error: state.error,
    loading: state.dataLoading
  })));

  useEffect(() => {
    if (course_id) {
      fetchCourse(course_id);
    }
  }, [course_id, fetchCourse]);

  useEffect(() => {
    if (course_id && !loading) {
      fetchTasks(course_id);
    }
  }, [course_id, fetchTasks, loading]);

  // if (loading || !course) return <Spin spinning size={'large'}/>
  if (error) {
    if (error === 'JSON object requested, multiple (or no) rows returned') {
      navigate('/course/not_found', {replace: true});
      return;
    }
    return <Alert message="Error" description={error} type="error" showIcon/>
  }
  if (!course) return null;

  return (
    <CourseProvider>
      <LayoutProvider>
        <CourseEdit/>
      </LayoutProvider>
    </CourseProvider>
  )
}