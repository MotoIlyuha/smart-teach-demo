import {NavigateFunction, Location} from "react-router-dom";
import {signInWithEmail} from "../../../../features/SupaBaseAuth.ts";
import {FormType} from "../../../../shared/types/AuthTypes.ts";
import {getUserByEmail} from "../../../../features/SupaBaseUsers.ts";

export const handleFinish = async (values: FormType, navigate: NavigateFunction, location: Location) => {
  signInWithEmail({
    email: values.email,
    password: values.password,
  })
    .then(() => {
      const fromPage = location.state?.from?.pathname;
      if (fromPage) navigate(fromPage, {replace: true});
      // else navigate('/');
      getUserByEmail(values.email)
        .then(user => navigate('/user/' + user.login, {replace: true, state: {success_login: true}}))
        .catch(e => navigate('/login', {state: {error: e}}));
    })
    .catch(e => {
      console.error(e);
      if (e.message === "Invalid login credentials") {
        navigate('/login', {replace: true, state: {error: "Неправильный логин или пароль"}});
      }
      else {
        console.error("ПРОИЗОШЛА НОВАЯ ОШИБКА", e);
        navigate('/login', {replace: true, state: {error: "Произошла ошибка"}});
      }
    })
};
