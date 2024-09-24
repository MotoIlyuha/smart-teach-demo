import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Divider, Flex, Space, Typography} from "antd";

import {Tables} from "../../types/supabase.ts";
import {getRole, getUserByLogin} from "../../features/SupaBaseUsers.ts";
import UploadAvatar from "../../widgets/User/UploadAvatarWidget.tsx";
import UserName from "../../widgets/User/UserNameWidget.tsx";
import UserRole from "../../widgets/User/UserRoleWidget.tsx";
import UserBirthday from "../../widgets/User/UserBirthdayWidget.tsx";
import UserGroup from "../../widgets/User/UserGroupWidget.tsx";


export default function UserPage() {
  const {user_login} = useParams();
  const [person, setPerson] = useState<Tables<'users'>>();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    if (user_login) {
      getUserByLogin(user_login)
        .then(person_by_login => {
          setPerson(person_by_login);
          getRole(person_by_login.role_id)
            .then(role => setUserRole(role.name))
            .catch(e => console.error(e))
        })
        .catch(e => console.error(e))
    }
  }, [user_login])

  if (person)
    return (
      <Space align='center' direction='horizontal' size='large' split={<Divider type="vertical"/>}>
        <UploadAvatar person={person}/>
        <Flex vertical>
          <UserRole userRole={userRole}/>
          <UserName person={person}/>
          <Flex gap={16} align={'baseline'}>
            <Typography.Text strong>{person.login}</Typography.Text>
            <Typography.Text>{person.email}</Typography.Text>
          </Flex>
          <UserBirthday person={person}/>
          <UserGroup person={person} userRole={userRole}/>
        </Flex>
      </Space>
    )
}