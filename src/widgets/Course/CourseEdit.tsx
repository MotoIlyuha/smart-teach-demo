import {Layout, Splitter} from "antd";
import {useLayout} from "../../shared/hok/Layout.ts";
import CourseEditSettings from "./components/CourseEditSettings.tsx";
import CourseEditCategories from "./components/CourseEditCategories.tsx";
import CourseLayoutContent from "./layout/LayoutContent.tsx";
import CourseLayoutSider from "./layout/LayoutSider.tsx";
import CourseSaveManager from "./components/CourseSaveManager.tsx";
import styles from '../../shared/styles/CourseEditPage.module.css';

export default function CourseEdit() {
  const {isRightSidebarVisible, isLeftSidebarVisible} = useLayout();

  return (
    <Layout className={styles.layout}>
      <Splitter>
        <Splitter.Panel
          defaultSize={'25%'}
          min={'20%'}
          max={'35%'}
          size={isLeftSidebarVisible ? undefined : 0}
        >
          <Layout.Sider width={'100%'} className={styles.sider}>
            <CourseEditSettings/>
            <CourseEditCategories/>
          </Layout.Sider>
        </Splitter.Panel>
        <Splitter.Panel>
          <Layout.Content className={styles.content}>
            <CourseLayoutContent/>
          </Layout.Content>
        </Splitter.Panel>
        <Splitter.Panel
          defaultSize={'25%'}
          min={'20%'}
          max={'35%'}
          size={isRightSidebarVisible ? undefined : 0}
        >
          <Layout.Sider width={'100%'} className={styles.sider}>
            <CourseLayoutSider/>
          </Layout.Sider>
        </Splitter.Panel>
      </Splitter>
      <CourseSaveManager/>
    </Layout>
  )
}