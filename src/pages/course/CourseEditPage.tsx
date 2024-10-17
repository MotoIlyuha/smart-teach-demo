import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {Alert, Layout} from 'antd';

import {useShallow} from "zustand/react/shallow";
import {useCourseStore} from "../../shared/stores/courseStore.ts";

import {CourseProvider} from "../../widgets/Course/CourseProvider.tsx";
import CourseEditSettings from "../../widgets/Course/CourseEditSettings.tsx";
import CourseEditCategories from "../../widgets/Course/CourseEditCategories.tsx";
import CourseSaveManager from "../../widgets/Course/CourseSaveManager.tsx";
import CourseLayoutContent from "../../widgets/Course/layout/LayoutContent.tsx";
import CourseLayoutSider from "../../widgets/Course/layout/LayoutSider.tsx";

import styles from '../../shared/styles/CourseEditPage.module.css';

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
    <CourseProvider>
      <Layout className={styles.layout}>
        <Layout.Sider width={320} className={styles.sider}>
          <CourseEditSettings/>
          <CourseEditCategories/>
        </Layout.Sider>
        <Layout.Content>
          <CourseLayoutContent/>
        </Layout.Content>
        <Layout.Sider width='25%' className={styles.sider}>
          <CourseLayoutSider/>
        </Layout.Sider>
        <CourseSaveManager/>
      </Layout>
    </CourseProvider>
  )
}