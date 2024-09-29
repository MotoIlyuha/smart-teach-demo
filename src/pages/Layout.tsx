import {Outlet} from "react-router-dom";
import {App, Layout, theme} from "antd";

import NavBar from "../widgets/NavBar/NavBar.tsx";
import BreadcrumbWidget from "../widgets/Dev/BreadcrumbWidget.tsx";

import {dev_mode, max_message_count} from "../config/allConfig.ts";
import styles from "../styles/layout.module.css";

const {Content, Footer, Header} = Layout;

export default function RootLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <App message={{maxCount: max_message_count}} notification={{placement: 'bottomRight'}}>
      <Layout className={styles.layout}>
        <Header className={styles.layoutHeader}>
          <NavBar/>
        </Header>
        <Content style={{ padding: '24px 48px'}}>
          {dev_mode && <BreadcrumbWidget/>}
          <Layout className={styles.layoutContent} style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet/>
          </Layout>
        </Content>
        <Footer className={styles.layoutFooter}>
          SmartTeach ©{new Date().getFullYear()} | Created by <a href={'https://github.com/MotoIlyuha'}>MotoIlyuha</a>
        </Footer>
      </Layout>
    </App>
  );
}