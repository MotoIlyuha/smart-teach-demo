import {Outlet, useLocation} from "react-router-dom";
import {App, Layout, theme} from "antd";

import NavBar from "../widgets/NavBar/NavBar.tsx";
import BreadcrumbWidget from "../widgets/Dev/BreadcrumbWidget.tsx";

import {dev_mode, max_message_count} from "../config/allConfig.ts";
import styles from "../styles/layout.module.css";

const {Content, Footer, Header} = Layout;

export default function RootLayout() {
  const {token: { colorBgContainer, borderRadiusLG }} = theme.useToken();
  const location = useLocation();
  const isCourseEditPage = location.pathname.split('/')[1] === 'course' && location.pathname.split('/')[3] === 'edit';

  return (
    <App message={{maxCount: max_message_count}} notification={{placement: 'bottomRight'}}>
      <Layout className={styles.layout}>
        <Header className={styles.layoutHeader}>
          <NavBar/>
        </Header>
        <Content style={ { padding: !isCourseEditPage ? '24px 48px' : 0}}>
          {dev_mode && <BreadcrumbWidget/>}
          <Layout className={!isCourseEditPage && styles.layoutContent}
                  style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet/>
          </Layout>
        </Content>
        <Footer className={styles.layoutFooter}>
          SmartTeach ©{new Date().getFullYear()} | Created by <a href={'https://github.com/MotoIlyuha'} style={{color: 'pink'}}>MotoIlyuha</a>
        </Footer>
      </Layout>
    </App>
  );
}