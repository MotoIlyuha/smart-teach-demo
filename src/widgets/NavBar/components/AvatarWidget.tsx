import {Link, useNavigate} from "react-router-dom";

import {Avatar, Button, Dropdown, MenuProps, Skeleton, Space, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";

import {useAuth} from "../../../hok/Auth.ts";

export default function AvatarWidget() {
  const {signOut, person, loading} = useAuth();
  const navigate = useNavigate();

  if (!person) return null;

  const items: MenuProps['items'] = [
    {
      label: (
        <Link key={person.login} to={'/user/' + person.login}>
          <Button type='link'>Профиль</Button>
        </Link>
      ),
      key: '0',
    },
    {
      label: (
        <Link key={person.login} to={'/user/' + person.login + '/settings'}>
          <Button type='link'>Настройки</Button>
        </Link>
      ),
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

  if (loading) return <Skeleton.Input active/>

  return (
    <Dropdown menu={{items}} trigger={['click']}>
      <Space>
        {(person.first_name && person.last_name) ? (
          <Typography.Text style={{color: '#fff'}} strong>
          {person.first_name} {person.last_name}</Typography.Text>
        ) : (
          <Typography.Text style={{color: '#fff'}} strong>{person.login}</Typography.Text>
        )}
        <Avatar style={{backgroundColor: '#87d068'}} src={person.avatar ?? ''}
                icon={<UserOutlined/>}/>
      </Space>
    </Dropdown>
  )
}