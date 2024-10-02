import {NavigateFunction} from 'react-router-dom';
import {NotificationInstance} from "antd/es/notification/interface";
import {signUpWithEmail} from "../../../../features/SupaBaseAuth.ts";
import {FormType} from "../../../../shared/types/AuthTypes.ts";


interface handleFinishProps {
  values: FormType
  notification: NotificationInstance
  navigate: NavigateFunction
  group_id?: string | null
}

export const handleFinish = async ({values, notification, navigate, group_id}: handleFinishProps) => {
  signUpWithEmail({
    login: values.login,
    email: values.email,
    password: values.password,
    group_id: group_id
  })
    .then(success => {
      if (!success)
        notification.error({message: 'Произошла ошибка при регистрации'});
      else {
        notification.success({
          message: 'Вы успешно зарегистрированы!',
          placement: 'bottomRight'
        })
        navigate('/user/' + values.login, {replace: true});
      }
    })
    .catch(e => {
      console.error(e);
      notification.error({message: e.message});
    })
};

