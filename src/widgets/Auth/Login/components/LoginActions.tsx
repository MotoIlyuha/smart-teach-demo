import {Button, Checkbox, Form, FormInstance, Space} from 'antd';
import React from "react";
import ForgotPasswordWidget from "../../ForgotPasswordWidget.tsx";
import {Link} from "react-router-dom";


type LoginActionsProps = {
    loadings: boolean[],
    setLoadings: React.Dispatch<React.SetStateAction<boolean[]>>
    form: FormInstance
}

export const LoginActions = ({loadings, setLoadings, form}: LoginActionsProps) => {

    const enterLoading = (index: number) => {
        form.validateFields({validateOnly: true}).then(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = true;
                return newLoadings;
            });

            setTimeout(() => {
                setLoadings((prevLoadings) => {
                    const newLoadings = [...prevLoadings];
                    newLoadings[index] = false;
                    return newLoadings;
                });
            }, 6000);
        })
    }

    return <>
        <Form.Item name="remember" valuePropName="checked">
            <Space>
                <Checkbox defaultChecked={true}>Запомнить меня</Checkbox>
                <ForgotPasswordWidget/>
            </Space>
        </Form.Item>

        <Form.Item style={{paddingBottom: 8}}>
            <Space direction='horizontal' size='small'>
                <Button type="primary" htmlType="submit" className="login-form-button" iconPosition='end'
                        onClick={() => enterLoading(0)} loading={loadings[0]}>
                    Войти
                </Button>
                <Link to={'/register'}>или зарегистрируйтесь!</Link>
            </Space>
        </Form.Item>
    </>
};
