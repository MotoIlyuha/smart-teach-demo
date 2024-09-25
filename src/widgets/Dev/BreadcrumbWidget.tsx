import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

import {Breadcrumb} from "antd";
import {HomeOutlined, UserOutlined, UsergroupAddOutlined} from "@ant-design/icons";

import supabase from "../../config/supabaseClient.ts";
import {Tables} from "../../types/supabase.ts";

export default function BreadcrumbWidget() {

  const location = useLocation();
  const [allUsers, setAllUsers] = useState<Tables<'users'>[]>([]);
  const [allGroups, setAllGroups] = useState<Tables<'student_groups'>[]>([]);

  const getSecondLevel = (path: string) => {
    switch (path.split('/')[1]) {
      case 'user':
        return 'Пользователи';
      case 'group':
        return 'Группы';
      default:
        return 'Главная';
    }
  }

  const secondLevel = getSecondLevel(location.pathname);

  useEffect(() => {
    supabase.from('users').select('*').then(({data}) => {
      setAllUsers(data || []);
    })
    supabase.from('student_groups').select('*').then(({data}) => {
      setAllGroups(data || []);
    })
  }, [])


  const getThirdLevel = () => {
    if (secondLevel === 'Пользователи') {
      return allUsers.map(user => {
        return {
          label: <Link to={'/user/' + user.login}>{user.first_name} {user.last_name} ({user.login})</Link>,
          key: user.id
        }
      })
    }
    else if (secondLevel === 'Группы') {
      return allGroups.map(group => {
        return {
          label: <Link to={'/group/' + group.id}>{group.name}</Link>,
          key: group.id
        }
      })
    }
    else return []
  }

  const thirdLevel = getThirdLevel();
  const getThirdLevelTitle = () => {
    if (secondLevel === 'Пользователи') {
      const currentUser = allUsers.filter(user => user.login === location.pathname.split('/')[2])[0];
      return currentUser?.first_name + ' ' + currentUser?.last_name + ' (' + currentUser?.login + ')';
    }
    else if (secondLevel === 'Группы') {
      const currentGroup = allGroups.filter(group => group.id === location.pathname.split('/')[2])[0];
      return currentGroup?.name;
    }
    else return ''
  }
  const thirdLevelTitle = getThirdLevelTitle();

  return (
    <Breadcrumb separator=">" style={{marginBottom: 12}} items={
      [
        {title: <HomeOutlined/>, href: '/'},
        {
          title: secondLevel, menu: {
            mode: 'vertical',
            items: [
              {label: <Link to={'/'}>Главная</Link>, key: 'main'},
              {
                label: 'Пользователи',
                key: 'users',
                icon: <UserOutlined/>,
                children: allUsers.map(user => (
                  {
                    //TODO: Вместо просто ссылок сделать UserMiniWidget
                    label: <Link to={'/user/' + user.login}>{user.first_name} {user.last_name} ({user.login})</Link>,
                    key: user.id
                  }
                ))
              },
              {
                label: 'Группы',
                key: 'groups',
                icon: <UsergroupAddOutlined />,
                children: allGroups.map(group => (
                  {
                    label: <Link to={'/group/' + group.id}>{group.name}</Link>,
                    key: group.id
                  }
                ))
              },
              {
                label: 'Авторизация', key: 'classes', type: 'group', children: [
                  {
                    label: <Link to={'/login'}>Вход</Link>,
                    key: 'login'
                  },
                  {
                    label: <Link to={'/register'}>Регистрация</Link>,
                    key: 'register'
                  },
                ]
              },
            ]
          }
        },
        {
          title: thirdLevelTitle,
          menu: {items: thirdLevel}
        }
      ]
    }/>
  )
}