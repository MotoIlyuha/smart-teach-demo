import {useNavigate} from "react-router-dom";
import {App, Form} from "antd";
import {RegisterFields} from "./components/RegisterFields.tsx";
import {RegisterActions} from "./components/RegisterActions";
import {handleFinish} from "./handlers/registerHandler";


export default function RegisterWidget() {
  const {notification} = App.useApp()
  const navigate = useNavigate();

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 10},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  };

  return (
    <Form
      {...formItemLayout}
      name="normal_register"
      className="register-form"
      onFinish={(values) => handleFinish(values, notification, navigate)}
      initialValues={{remember: true}}
      style={{maxWidth: 800}}
      scrollToFirstError
    >
      <RegisterFields/>
      <RegisterActions/>
    </Form>
  );
}
