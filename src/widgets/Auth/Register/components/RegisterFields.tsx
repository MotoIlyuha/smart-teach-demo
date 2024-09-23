import {Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {checkIfEmailExists, checkIfLoginExists} from "../../../../features/SupaBaseAuth.ts";

export const RegisterFields = () => (
  <>
    <Form.Item
      name="login"
      label='Логин'
      tooltip="По этому логину потом можно будет входить в систему"
      hasFeedback
      validateDebounce={400}
      validateFirst
      rules={[
        {required: true, message: 'Пожалуйста, введите свой логин!'},
        {min: 4, message: 'Слишком короткий логин'},
        {
          pattern: /^[^\s.,:;!?]+$/,
          message: 'Логин не должен содержать пробелы и знаки препинания',
        },
        {
          validator: async (_, value: string) => {
            if (value && await checkIfLoginExists(value.trim())) {
              return Promise.reject(new Error('Пользователь с таким логином уже существует!'));
            }
          }
        }
      ]}
    >
      <Input prefix={<UserOutlined className="site-form-item-icon"/>}/>
    </Form.Item>

    <Form.Item
      name="email"
      label='Эл. почта'
      hasFeedback
      validateDebounce={400}
      validateFirst
      rules={[
        {required: true, type: 'email', message: 'Некорректный формат электронной почты!'},
        {
          validator: async (_, value: string) => {
            if (value && await checkIfEmailExists(value)) {
              return Promise.reject(new Error('Пользователь с такой почтой уже существует!'));
            }
          }
        }
      ]}
    >
      <Input prefix={<UserOutlined className="site-form-item-icon"/>}/>
    </Form.Item>

    <Form.Item
      name="password"
      label="Пароль"
      validateDebounce={600}
      rules={[
        {required: true, message: 'Пожалуйста, введите свой пароль!'},
        {min: 6, message: 'Пароль должен быть не менее 6 символов'}
      ]}
    >
      <Input.Password
        prefix={<LockOutlined className="site-form-item-icon"/>}
        type="password"
      />
    </Form.Item>

    <Form.Item
      name="confirm"
      label='Подтвердите пароль'
      dependencies={['password']}
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Пожалуйста, подтвердите свой пароль!',
        },
        ({getFieldValue}) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Пароли не совпадают!'));
          },
        }),
      ]}
    >
      <Input.Password
        prefix={<LockOutlined className="site-form-item-icon"/>}
        type="password"
      />
    </Form.Item>
  </>
)