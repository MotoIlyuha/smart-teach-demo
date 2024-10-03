import {Link} from "react-router-dom";
import {Flex, Tag} from "antd";

import styles from "../../shared/styles/navBar.module.css";
import SignInWidget from "./components/SignInWidget.tsx";
import AvatarWidget from "./components/AvatarWidget.tsx";
import {useAuth} from "../../shared/hok/Auth.ts";

export default function NavBar() {
  const {user} = useAuth();

  return (
    <>
      <Link to={'/'}>
        <Flex gap={8} align={'center'}>
          <h1 className={styles.logo}>SmartTeach</h1>
          <Tag color="blue">demo</Tag>
        </Flex>
      </Link>
      {user ? (
        <AvatarWidget user={user}/>
      ) : (
        <SignInWidget/>
      )}
    </>
  )
}