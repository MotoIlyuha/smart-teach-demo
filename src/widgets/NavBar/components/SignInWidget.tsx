import {Button, Space} from "antd";
import { UserAddOutlined } from '@ant-design/icons'
import LoginPopover from "../../Auth/Login/LoginPopover.tsx";
import {Link} from "react-router-dom";

export default function SignInWidget() {
  return (
    <Space>
      <LoginPopover/>
      <Link to={'/register'}>
        <Button type='primary' icon={<UserAddOutlined/>}>Регистрация</Button>
      </Link>
    </Space>
  )
}