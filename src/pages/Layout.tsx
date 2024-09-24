import {Outlet} from "react-router-dom";
import {App, Layout} from "antd";

import NavBar from "../widgets/NavBar/NavBar.tsx";

import styles from "../styles/layout.module.css";
import {max_message_count} from "../config/allConfig.ts";

const {Content, Footer, Header} = Layout;

export default function RootLayout() {
  return (
    <App message={{maxCount: max_message_count}} notification={{placement: 'bottomRight'}}>
      <Layout className={styles.layout}>
        <Header className={styles.layoutHeader}>
          <NavBar/>
        </Header>
        <Content className={styles.layoutContent}>
          <Outlet/>
        </Content>
        <Footer className={styles.layoutFooter}>
          SmartTeach ©{new Date().getFullYear()} | Created by <a href={'https://github.com/MotoIlyuha'}>MotoIlyuha</a>
        </Footer>
      </Layout>
    </App>
  );
}