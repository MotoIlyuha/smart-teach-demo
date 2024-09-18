import {Outlet} from "react-router-dom";
import {Layout} from "antd";

import NavBar from "../widgets/NavBar/NavBar.tsx";

import styles from "./layout.module.css";

const {Content, Footer, Header} = Layout;

export default function RootLayout() {
  return (
    <html lang="ru">
    <body>
    {/*<AppProvider>*/}
      <Layout className={styles.layout}>
        <Header className={styles.layoutHeader}>
          <NavBar/>
        </Header>
        <Content className={styles.layoutContent}>
          <Outlet/>
        </Content>
        <Footer className={styles.layoutFooter}>
          © 2024 SmartTeach
        </Footer>
      </Layout>
    {/*</AppProvider>*/}
    </body>
    </html>
  );
}