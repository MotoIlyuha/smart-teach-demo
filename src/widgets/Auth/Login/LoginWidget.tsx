import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {Form} from 'antd';

import {handleFinish} from './handlers/loginHandler';
import {LoginFields} from './components/LoginFields';
import {LoginActions} from './components/LoginActions';


export default function LoginWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  const form = Form.useForm()[0];
  const [loadings, setLoadings] = useState<boolean[]>([]);

  return (
    <Form
      form={form}
      name="normal_login"
      className="login-form"
      initialValues={{remember: true}}
      onFinish={(values) => {
        handleFinish(values, navigate, location)
          .then(() => setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[0] = false;
            return newLoadings;
          }))
      }}
      style={{margin: 8, marginBottom: -16}}
    >
      <LoginFields/>
      <LoginActions loadings={loadings} setLoadings={setLoadings} form={form}/>
    </Form>
  );
}
