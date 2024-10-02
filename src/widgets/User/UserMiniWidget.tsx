import {useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Button, Popover, Typography} from "antd";
import {Tables} from "../../shared/types/supabase.ts";
import styles from "../../styles/UserMiniWidget.module.css";
import {UserOutlined, MoreOutlined} from "@ant-design/icons";
import UserMegaWidget from "./UserMegaWidget.tsx";

export default function UserMini({person}: { person: Tables<'users'> }) {
  const [open, setOpen] = useState(false);

  if (person)
    return (
      <Button className={styles.button} type={'dashed'}>
        <Avatar
          shape={'circle'}
          src={person.avatar}
          icon={<UserOutlined/>}
          size={'small'}
        />
        <Link to={'/user/' + person.login}>
          {person.first_name === null || person.last_name === null ? (
            <Typography.Text>{person.login}</Typography.Text>
          ) : (
            <Typography.Text>{person.first_name} {person.last_name}</Typography.Text>
          )}
        </Link>
        <Popover open={open} onOpenChange={setOpen} content={<UserMegaWidget person={person}/>}>
          <Button icon={<MoreOutlined/>} type={'link'} onClick={() => setOpen(true)}
                  style={{padding: 0, width: 'fit-content'}}/>
        </Popover>
      </Button>
    )
}