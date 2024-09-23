import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Divider, Flex, Space, Typography} from "antd";

import {Tables} from "../../types/supabase.ts";
import {getUserByLogin} from "../../features/SupaBaseUsers.ts";
import UploadAvatar from "../../widgets/User/UploadAvatarWidget.tsx";
import UserName from "../../widgets/User/UserNameWidget.tsx";
import UserRole from "../../widgets/User/UserRoleWidget.tsx";
import UserBirthday from "../../widgets/User/UserBirthdayWidget.tsx";


export default function UserPage() {
  const {user_login} = useParams();
  const [person, setPerson] = useState<Tables<'users'>>();

  useEffect(() => {
    if (user_login) {
      getUserByLogin(user_login)
        .then(person_by_login => {
          setPerson(person_by_login);
        })
        .catch(e => console.error(e))
    }
  }, [user_login])

  if (person)
    return (
      <Space align='center' direction='horizontal' size='large' split={<Divider type="vertical"/>}>
        <UploadAvatar person={person}/>
        <Flex vertical>
          <Flex gap={16} align={'baseline'}>
            <UserName person={person}/>
            <UserRole person={person}/>
          </Flex>
          <Flex gap={16} align={'baseline'}>
            <Typography.Text strong>{person.login}</Typography.Text>
            <Typography.Text>{person.email}</Typography.Text>
          </Flex>
          <UserBirthday person={person}/>
        </Flex>
      </Space>
    )
}