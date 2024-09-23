import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {User} from "@supabase/supabase-js";

import {Button, MenuProps, Dropdown, Space, Typography, Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";

import {useAuth} from "../../../hooks/Auth.tsx";
import {getUserByEmail} from "../../../features/SupaBaseUsers.ts";
import {Tables} from "../../../types/supabase.ts";

export default function AvatarWidget({user}: {user: User}) {
  const {signOut} = useAuth();
  const navigate = useNavigate()
  const [person, setPerson] = useState<Tables<'users'>>();

  useEffect(() => {
    if (user.email !== undefined)
      getUserByEmail(user.email)
        .then(person_by_email => setPerson(person_by_email))
        .catch(e => console.error(e));
  }, [user])

  const items: MenuProps['items'] = [
    {
      label: <Link key={person?.login} to={'/user/' + person?.login}><Button type='link'>Профиль</Button></Link>,
      key: '0',
    },
    {
      label: <Link key={person?.login} to={'/user/' + person?.login + '/settings'}><Button type='link'>Настройки</Button></Link>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <Button type='link' danger={true} onClick={() => {
        signOut();
        navigate('/login');
      }}>Выход</Button>,
      key: '3',
    },
  ];

  return (
    <Dropdown menu={{items}} trigger={['click']}>
      <Space>
        {(person?.first_name && person?.last_name) ? (
          <Typography.Text style={{color: '#fff'}} strong>
          {person?.first_name} {person?.last_name}</Typography.Text>
        ) : (
          <Typography.Text style={{color: '#fff'}} strong>{person?.login}</Typography.Text>
        )}
        <Avatar style={{backgroundColor: '#87d068'}} src={person?.avatar ?? ''}
                icon={person?.avatar ? "" : <UserOutlined/>}/>
      </Space>
    </Dropdown>
  )
}