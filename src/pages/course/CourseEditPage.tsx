import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {Alert, Layout} from 'antd';

import {useShallow} from "zustand/react/shallow";
import {useCourseStore} from "../../shared/stores/courseStore.ts";

import styles from '../../styles/CourseEditPage.module.css';
import CourseEditSettings from "../../widgets/Course/CourseEditSettings.tsx";

export default function CourseEditPage() {
  const {course_id} = useParams();
  const navigate = useNavigate();
  const {course, fetchCourse, error} = useCourseStore(useShallow(state => ({
    course: state.course,
    fetchCourse: state.fetchCourse,
    error: state.error
  })));

  useEffect(() => {
    if (course_id) {
      fetchCourse(course_id);
    }
  }, [course_id, fetchCourse]);

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
    <Layout className={styles.layout}>
      <Layout.Sider width={320} className={styles.sider}>
        <CourseEditSettings/>
      </Layout.Sider>
      <Layout.Content>Content</Layout.Content>
      <Layout.Sider width='25%'>
        Sider
      </Layout.Sider>
    </Layout>
  )
}