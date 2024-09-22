import {Button, Checkbox, Col, Form, Input, Row} from "antd";


const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 10,
        },
        sm: {
            span: 24,
            offset: 10,
        },
    },
};


export const RegisterActions = () => (
    <>
        <Form.Item label="Captcha" extra="Мы должны убедиться, что вы человек.">
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{required: true, message: 'Пожалуйста, введите полученную капчу!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Button>Получить капчу</Button>
                </Col>
            </Row>
        </Form.Item>

        <Form.Item
            {...tailFormItemLayout}
            name="agreement"
            valuePropName="checked"
            rules={[
                {
                    validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('Вы должны принять соглашение')),
                },
            ]}
        >
            <Checkbox>
                Я прочитал <a href="">соглашение</a>
            </Checkbox>
        </Form.Item>

        <Form.Item
            {...tailFormItemLayout}
        >
            <Button type="primary" htmlType="submit" className="register-form-button">
                Зарегистрироваться
            </Button>
        </Form.Item>
    </>
)