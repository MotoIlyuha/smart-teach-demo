import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

import {Breadcrumb, Button, Typography} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FundProjectionScreenOutlined,
  PlusOutlined
} from "@ant-design/icons";

import supabase from "../../config/supabaseClient.ts";
import {Tables} from "../../types/supabase.ts";
import UserMini from "../User/UserMiniWidget.tsx";
import {BreadcrumbItemType} from "antd/es/breadcrumb/Breadcrumb";

export default function BreadcrumbWidget() {

  const location = useLocation();
  const [allUsers, setAllUsers] = useState<Tables<'users'>[]>([]);
  const [allGroups, setAllGroups] = useState<Tables<'student_groups'>[]>([]);
  const [allCourses, setAllCourses] = useState<Tables<'courses'>[]>([]);

  const getSecondLevel = (path: string) => {
    switch (path.split('/')[1]) {
      case 'user':
        return 'Пользователи';
      case 'group':
        return 'Группы';
      case 'course':
        return 'Курсы';
      case 'login':
        return 'Авторизация';
      case 'register':
        return 'Регистрация';
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
    supabase.from('courses').select('*').then(({data}) => {
      setAllCourses(data || []);
    })
  }, [])


  const getThirdLevel = (level: string) => {
    if (level === 'Пользователи') {
      return [
        {
          label: <Link to={'/users'}>
            <Typography.Link>Все пользователи</Typography.Link>
          </Link>,
          key: 'all_users'
        },
        ...allUsers.slice(0, 7).map(user => ({
          label: <Link to={'/user/' + user.login}><UserMini person={user}/></Link>,
          key: user.id
        })),
        allUsers.length > 7 && {
          label: '... и так далее',
          key: 'more_users',
          type: 'group'
        },
        {
          label: <Link to={'/user/new'}>
            <Button icon={<PlusOutlined />}>Добавить пользователя</Button>
          </Link>,
          key: 'all_users'
        }
      ]
    } else if (level === 'Группы') {
      return [
        {
          label: <Link to={'/group'}>
            <Typography.Link>Все группы</Typography.Link>
          </Link>,
          key: 'all_groups'
        },
        ...allGroups.map(group => ({
          label: <Link to={'/group/' + group.id}>{group.name}</Link>,
          key: group.id
        })),
        allGroups.length > 7 && {
          label: '... и так далее',
          key: 'more_groups',
          type: 'group'
        },
        {
          label: <Link to={'/group/new'}>
            <Button icon={<PlusOutlined />}>Добавить группу</Button>
          </Link>,
          key: 'all_groups'
        }
      ]
    } else if (level === 'Курсы') {
      return [
        {
          label: <Link to={'/courses/'}>
            <Typography.Link>Все курсы</Typography.Link>
          </Link>,
          key: 'all_courses'
        },
        ...allCourses.map(course => ({
          label: <Link to={'/course/' + course.id}>{course.title}</Link>,
          key: course.id
        })),
        allCourses.length > 7 && {
          label: '... и так далее',
          key: 'more_courses',
          type: 'group'
        },
        {
          label: <Link to={'/course/new'}>
            <Button icon={<PlusOutlined />}>Добавить курс</Button>
          </Link>,
          key: 'all_courses'
        }
      ]
    }
    else return []
  }
  const thirdLevel = getThirdLevel(secondLevel);

  const getThirdLevelTitle = () => {
    const split = location.pathname.split('/');
    if (secondLevel === 'Пользователи') {
      if (split[1] === 'user' && !split[2]) return 'Все пользователи'
      if (split[1] === 'user' && split[2] === 'new') return '+ Новый пользователь'
      const currentUser = allUsers.filter(user => user.login === location.pathname.split('/')[2])[0];
      return (currentUser?.first_name && currentUser?.last_name) ?
        currentUser?.first_name + ' ' + currentUser?.last_name + ' (' + currentUser?.login + ')' :
        currentUser?.login;
    } else if (secondLevel === 'Группы') {
      if (split[1] === 'group' && !split[2]) return 'Все группы'
      if (split[1] === 'group' && split[2] === 'new') return '+ Новая группа'
      const currentGroup = allGroups.filter(group => group.id === location.pathname.split('/')[2])[0];
      return currentGroup?.name;
    } else if (secondLevel === 'Курсы') {
      if (split[1] === 'course' && !split[2]) return 'Все курсы'
      if (split[1] === 'course' && split[2] === 'new') return '+ Новый курс'
      const currentCourse = allCourses.filter(course => course.id === location.pathname.split('/')[2])[0];
      return currentCourse?.title;
    } else return '';
  }
  const thirdLevelTitle = getThirdLevelTitle();

  const breadcrumbItems = [
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
            children: getThirdLevel('Пользователи')
          },
          {
            label: 'Группы',
            key: 'groups',
            icon: <UsergroupAddOutlined/>,
            children: getThirdLevel('Группы')
          },
          {
            label: 'Курсы',
            key: 'courses',
            icon: <FundProjectionScreenOutlined />,
            children: getThirdLevel('Курсы')
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
    thirdLevelTitle ? {
      title: thirdLevelTitle,
      menu: {items: thirdLevel}
    } : {}
  ];

  return (
    <Breadcrumb separator=">" style={{marginBottom: 12}} items={breadcrumbItems as Partial<BreadcrumbItemType>[]}/>
  )
}