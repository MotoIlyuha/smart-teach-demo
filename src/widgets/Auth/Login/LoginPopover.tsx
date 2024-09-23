import {useEffect, useState} from "react";
import {Button, Popover} from 'antd';
import {UserOutlined} from "@ant-design/icons";
import LoginWidget from "./LoginWidget.tsx";
import {useLocation} from "react-router-dom";


export default function LoginPopover() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login' || location.state?.success_login)
      setOpen(false);
  }, [location]);

  const handleOpenChange = (newOpen: boolean) => {
    if (location.pathname !== '/login')
      setOpen(newOpen);
  };

  return (
    <Popover
      content={<LoginWidget/>}
      title="Вход в систему"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="link" icon={<UserOutlined/>} style={{color: 'white'}}>Вход</Button>
    </Popover>
  );
}