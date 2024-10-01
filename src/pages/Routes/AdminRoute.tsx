import {ReactNode} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../../hok/Auth.ts";
import {App} from "antd";
import {useEffect} from 'react';

const AdminRoute = ({children}: { children: ReactNode }) => {
  const {person: user, loading} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {message} = App.useApp();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      message.error('Вы не авторизованы!').then();
      navigate('/login', {state: {from: location}});
    } else if (user.role_name !== 'admin') {
      message.error('У вас нет прав администратора!');
      navigate(-1);
    }
  }, [navigate, user, loading, location, message]);

  return <>{children}</>;
};

export default AdminRoute;
