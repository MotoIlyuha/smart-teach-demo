import {Tables} from "../../shared/types/supabase.ts";
import {Divider, Flex, Space, Typography} from "antd";
import UserAvatar from "./UserAvatar.tsx";
import {Link} from "react-router-dom";

export default function UserMegaWidget({person}: { person: Tables<'users'> }) {
  return (
    <Space direction={'horizontal'} split={<Divider variant={'solid'} type={'vertical'}/>} align={'start'}>
      <UserAvatar avatar_url={person.avatar || ''} size={140}/>
      <Flex gap={8} align={'start'} vertical>
        <Link to={'/user/' + person.login}>
          {person.first_name && person.last_name ? (
            <Typography.Title level={3}>{person.first_name} {person.last_name}</Typography.Title>
          ) : (
            <Typography.Title level={3}>{person.login}</Typography.Title>
          )}
        </Link>
      </Flex>
    </Space>
  )
}