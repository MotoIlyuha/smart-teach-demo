import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Divider, Flex, Space, Typography} from "antd";

import {Tables} from "../../types/supabase.ts";
import {getRole, getUserByLogin} from "../../features/SupaBaseUsers.ts";
import UploadAvatar from "../../widgets/User/UploadAvatarWidget.tsx";
import UserName from "../../widgets/User/UserNameWidget.tsx";
import UserRole from "../../widgets/User/UserRoleWidget.tsx";
import UserBirthday from "../../widgets/User/UserBirthdayWidget.tsx";
import UserGroup from "../../widgets/Group/UserGroupWidget.tsx";
import {useAuth} from "../../hok/Auth.ts";


export default function UserPage() {
  const {user_login} = useParams();
  const {person: i_am} = useAuth()
  const [page_person, setPage_person] = useState<Tables<'users'>>();
  const [userRole, setUserRole] = useState<string>();

  const itsMe = i_am?.login === user_login;

  useEffect(() => {
    if (user_login) {
      if (itsMe && i_am) setPage_person(i_am);
      else 
        getUserByLogin(user_login)
          .then(person_by_login => {
            setPage_person(person_by_login);
            getRole(person_by_login.role_id)
              .then(role => setUserRole(role.name))
              .catch(e => console.error(e))
          })
          .catch(e => console.error(e))
    }
  }, [i_am, itsMe, page_person, user_login])

  if (page_person)
    return (
      <Space align='center' direction='horizontal' size='large' split={<Divider type="vertical"/>}>
        <UploadAvatar person={page_person} itsMe={itsMe}/>
        <Flex vertical>
          {userRole && <UserRole userRole={userRole}/>}
          <UserName person={page_person} itsMe={itsMe}/>
          <Flex gap={16} align={'baseline'}>
            <Typography.Text strong>{page_person.login}</Typography.Text>
            <Typography.Text>{page_person.email}</Typography.Text>
          </Flex>
          <UserBirthday person={page_person} itsMe={itsMe}/>
          {userRole && <UserGroup person={page_person} userRole={userRole}/>}
        </Flex>
      </Space>
    )
}