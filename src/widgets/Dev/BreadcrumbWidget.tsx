import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

import {Breadcrumb, Button, Typography} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FundProjectionScreenOutlined,
  PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";

import supabase from "../../shared/config/supabaseClient.ts";
import UserMini from "../User/UserMiniWidget.tsx";
import {BreadcrumbItemType} from "antd/es/breadcrumb/Breadcrumb";
import {Tables} from "../../shared/types/supabase.ts";

export default function BreadcrumbWidget() {

  const location = useLocation();
  const split = location.pathname.split('/');
  const [allUsers, setAllUsers] = useState<Tables<'users'>[]>([]);
  const [allGroups, setAllGroups] = useState<Tables<'student_groups'>[]>([]);
  const [allCourses, setAllCourses] = useState<Tables<'courses'>[]>([]);

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

  const getSecondLevelTitle = () => {
    switch (split[1]) {
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

  const secondLevelTitle = getSecondLevelTitle();

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
          key: 'add_user'
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
          key: 'add_groups'
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
          key: 'add_course'
        }
      ]
    }
    else return []
  }
  const thirdLevel = getThirdLevel(secondLevelTitle);

  const getThirdLevelTitle = () => {
    if (secondLevelTitle === 'Пользователи') {
      if (split[1] === 'user' && !split[2]) return 'Все пользователи'
      if (split[1] === 'user' && split[2] === 'new') return 'Зарегистрировать пользователя'
      const currentUser = allUsers.filter(user => user.login === split[2])[0];
      return (currentUser?.first_name && currentUser?.last_name) ?
        currentUser?.first_name + ' ' + currentUser?.last_name + ' (' + currentUser?.login + ')' :
        currentUser?.login;
    } else if (secondLevelTitle === 'Группы') {
      if (split[1] === 'group' && !split[2]) return 'Все группы'
      if (split[1] === 'group' && split[2] === 'new') return 'Добавить группу'
      const currentGroup = allGroups.filter(group => group.id === split[2])[0];
      return currentGroup?.name;
    } else if (secondLevelTitle === 'Курсы') {
      if (split[1] === 'course' && !split[2]) return 'Все курсы'
      if (split[1] === 'course' && split[2] === 'new') return 'Создать курс'
      const currentCourse = allCourses.filter(course => course.id === split[2])[0];
      return currentCourse?.title;
    } else return '';
  }
  const thirdLevelTitle = getThirdLevelTitle();

  const getFourthLevel = () => {
    if (secondLevelTitle === 'Курсы') {
      return [
        {
          label: <Link to={'/course/' + split[2]}>
            <Typography.Text>Посмотреть</Typography.Text>
          </Link>,
          icon: <EyeOutlined/>,
          key: 'view_course'
        },
        {
          label: <Link to={'/course/' + split[2] + '/edit'}>
            <Typography.Text>Редактировать</Typography.Text>
          </Link>,
          icon: <EditOutlined/>,
          key: 'edit_course'
        },
        {
          label: <Link to={'/course/' + split[2] + '/delete'}>
            <Typography.Text style={{color: 'red'}}>Удалить</Typography.Text>
          </Link>,
          icon: <DeleteOutlined/>,
          style: {color: 'red'},
          key: 'delete_course'
        }
      ]
    }
  }

  const getFourthLevelTitle = () => {
    if (secondLevelTitle === 'Курсы') {
      if (thirdLevelTitle !== 'Все курсы' && split[2] !== 'new') {
        if (split[1] === 'course' && !split[3]) return 'Просмотр'
        if (split[1] === 'course' && split[3] === 'edit') return 'Редактирование'
        if (split[1] === 'course' && split[3] === 'delete') return 'Удалить'
      }
    }
  }
  const fourthLevel = getFourthLevel();
  const fourthLevelTitle = getFourthLevelTitle();

  const breadcrumbItems = () => [
    {title: <HomeOutlined/>, href: '/'},
    {
      title: secondLevelTitle, menu: {
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
    } : {},
    thirdLevelTitle && fourthLevelTitle ? {
      title: fourthLevelTitle,
      menu: {items: fourthLevel}
    } : {},
  ] as Partial<BreadcrumbItemType>[];

  return (
    <Breadcrumb separator=">" style={{padding: '12px 24px'}} items={breadcrumbItems()}/>
  )
}