import RegisterWidget from "../../widgets/Auth/Register/RegisterWidget.tsx";
import {useEffect, useState} from "react";
import {Alert, Space} from "antd";

export default function RegisterPage() {

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem('register_error')) {
      const error = JSON.parse(sessionStorage.getItem('register_error')!);
      setErrorMessage(error.message);
      sessionStorage.removeItem('register_error');
    }
  }, []);

  return (
    <Space align='center' direction='vertical' size='large'>
      {errorMessage && <Alert message='Ошибка!' description={errorMessage} type="error" showIcon/>}
      <RegisterWidget/>
    </Space>
  )
}
