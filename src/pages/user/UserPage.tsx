import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Alert, Descriptions, Divider, Flex, Skeleton, Space} from "antd";
import UploadAvatar from "../../widgets/User/UploadAvatarWidget.tsx";
import UserName from "../../widgets/User/UserNameWidget.tsx";
import UserBirthday from "../../widgets/User/UserBirthdayWidget.tsx";
import UserGroup from "../../widgets/Group/UserGroupWidget.tsx";
import {useAuth} from "../../hok/Auth.ts";
import {useUserStore} from "../../shared/stores/userStore.ts";
import {useShallow} from "zustand/react/shallow";

export default function UserPage() {
  const {user_login} = useParams<{ user_login: string }>();
  const {person, loading: auth_loading} = useAuth();
  const {user: pagePerson, fetchUser, loading, error} = useUserStore(useShallow(state => ({
    user: state.user,
    fetchUser: state.fetchUser,
    loading: state.loading,
    error: state.error,
  })));

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (person && user_login) {
      const isCurrentUser = person.login === user_login;
      const isAdmin = person.role_name === "admin";
      setIsEditable(isCurrentUser || isAdmin);
      console.log("FETCH", user_login);
      fetchUser(user_login);
    }
  }, [person, user_login, fetchUser]);

  if (error) return <Alert message="Ошибка" description={error} type="error" showIcon/>;

  if (loading || auth_loading || (!pagePerson && !person)) return (
    <Space align={'center'}>
      <Skeleton active/>
    </Space>
  );

  if (pagePerson)
    return (
      <Space align='start' direction='horizontal' size='large' split={<Divider type="vertical"/>}
             style={{height: '100%'}}>
        <UploadAvatar editable={isEditable}/>
        <Flex vertical>
          <UserName editable={isEditable}/>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={'Почта'}>{pagePerson.email}</Descriptions.Item>
            <Descriptions.Item label={'Логин'}>{pagePerson.login}</Descriptions.Item>
            <Descriptions.Item label={'Дата рождения'}>
              <UserBirthday editable={isEditable}/>
            </Descriptions.Item>
            {person?.role_name !== 'admin' && (
              <>
                {pagePerson.group_name ? (
                  <Descriptions.Item label={pagePerson.role_name === 'teacher' ? 'Классный руководитель для' : 'Класс'}>
                    <UserGroup/>
                  </Descriptions.Item>
                ) : (
                  <Descriptions.Item label={'Класс'}>
                    {pagePerson.role_name === 'teacher' ? 'Не является классным руководителем' : 'Не принадлежит ни одному классу'}
                  </Descriptions.Item>
                )}
              </>
            )}
          </Descriptions>
        </Flex>
      </Space>
    );
  else return null;
}
