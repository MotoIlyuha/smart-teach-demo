import {NavigateFunction} from 'react-router-dom';
import {NotificationInstance} from "antd/es/notification/interface";
import {signUpWithEmail} from "../../../../features/SupaBaseAuth.ts";
import {FormType} from "../../../../types/AuthTypes.ts";


export const handleFinish = async (values: FormType, notification: NotificationInstance, navigate: NavigateFunction) => {
  signUpWithEmail({
    login: values.login,
    email: values.email,
    password: values.password
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

