import type {FormInstance} from 'antd';
import {Button, Col, Form, Input, Modal, Row} from "antd";
import React, {useState} from "react";


interface SubmitButtonProps {
    form: FormInstance;
    onClick: () => void;
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({form, children, onClick}) => {
    const [submittable, setSubmittable] = React.useState<boolean>(false);

    // Watch all values
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form
            .validateFields({validateOnly: true})
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} onClick={onClick}>
            {children}
        </Button>
    );
};

export default function ForgotPasswordWidget() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // TODO Реализовать отправку письма на почту для восстановления пароля
        Modal.success({
            title: 'Письмо отправлено',
            content: 'На вашу почту было отправлено письмо с инструкциями по восстановлению пароля',
        });
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const form = Form.useForm()[0];

    return (
        <>
            <Button type={'link'} className="login-form-forgot" onClick={showModal}>
                Забыли пароль?
            </Button>
            <Modal
                title="Восстановить пароль" open={isModalOpen}
                onCancel={handleCancel}
                destroyOnClose
                footer={[
                    <SubmitButton form={form} key="submit" onClick={handleOk}>Восстановить</SubmitButton>,
                    <Button key="back" onClick={handleCancel}>Отмена</Button>,
                ]}
            >
                <Form
                    {...{labelCol: {span: 6}, wrapperCol: {span: 16}}}
                    form={form}
                    name="normal_forgot_password"
                    className="login-form"
                    style={{maxWidth: 800}}
                    onFinish={handleOk}
                >
                    <Form.Item name="email" label='Эл. почта'
                               hasFeedback={true}
                               validateDebounce={450}
                               rules={[{required: true, type: 'email', message: 'Пожалуйста, введите свою почту!'}]}
                    >
                        <Input placeholder="Введите электронную почту для восстановления пароля"/>
                    </Form.Item>

                    <Form.Item label="Капча" extra="Мы должны убедиться, что вы человек." required={true}>
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

                </Form>
            </Modal>
        </>
    );
}