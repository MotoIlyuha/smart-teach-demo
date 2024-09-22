import {ReactNode} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../hooks/Auth";
import {App} from "antd";

const ProtectedRoute = ({children}: { children: ReactNode }) => {
  const {user} = useAuth()
  const location = useLocation()
  const {message} = App.useApp()

  if (!user) {
    // user is not authenticated
    message.error('Вы не авторизованы!').then()
    return <Navigate to="/login" state={{from: location}}/>;
  }
  return <>{children}</>
};

export default ProtectedRoute;