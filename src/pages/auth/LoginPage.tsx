import {Alert, Space} from "antd";
import LoginWidget from "../../widgets/Auth/Login/LoginWidget.tsx";
import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
// import {useEffect} from "react";

export default function LoginPage() {
  const location = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    setError(location.state?.error);
  }, [location.state?.error]);

  return (
    <Space align='center' direction='vertical' size='large'>
      {error && <Alert message='Ошибка!' description={error} type="error" showIcon/>}
      <LoginWidget/>
    </Space>
  )
}