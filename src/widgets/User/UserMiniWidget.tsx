import {Link} from "react-router-dom";
import {Avatar, Button, Typography} from "antd";
import {Tables} from "../../types/supabase.ts";
import styles from "../../styles/UserMiniWidget.module.css";
import {UserOutlined} from "@ant-design/icons";

export default function UserMini({person}: {person: Tables<'users'>}) {
  return (
    <Link to={'/user/' + person.login}>
      <Button className={styles.button} type={'dashed'}>
        <Avatar
          shape={'circle'}
          src={person.avatar}
          icon={<UserOutlined/>}
          size={'small'}
        />
        <Typography.Text>{person.first_name} {person.last_name}</Typography.Text>
      </Button>
    </Link>
  )
}