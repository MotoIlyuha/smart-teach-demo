import { Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export const LoginFields = () => (
    <>
        <Form.Item
            name="email"
            rules={[{ required: true, message: 'Пожалуйста, введите свою почту или логин!' }]}
        >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Эл. почта или логин" />
        </Form.Item>
        <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите свой пароль!' }]}
        >
            <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Пароль"
            />
        </Form.Item>
    </>
);
