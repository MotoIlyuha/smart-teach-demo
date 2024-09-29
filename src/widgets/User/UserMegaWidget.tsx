import {Tables} from "../../types/supabase.ts";
import {Divider, Flex, Space, Typography} from "antd";
import UserAvatar from "./UserAvatar.tsx";
import {Link} from "react-router-dom";

export default function UserMegaWidget({person}: {person: Tables<'users'>}) {
  return (
    <Space direction={'horizontal'} split={<Divider variant={'solid'} type={'vertical'}/>} align={'start'}>
      <UserAvatar avatar_url={person.avatar || ''} size={140}/>
      <Flex gap={8} align={'start'} vertical>
        <Link to={'/user/' + person.login}>
          <Typography.Text strong>{person.first_name} {person.last_name}</Typography.Text>
        </Link>
      </Flex>
    </Space>
  )
}