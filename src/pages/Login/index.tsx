import React from "react";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from "react-router-dom";
import CenteredContainer from "src/additional/centeredContainer";
import useAuthRedirect from "src/additional/authCheck";
import { useAppDispatch } from "src/store/hooks";

const Login = () => {
    useAuthRedirect();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = (values: any) => {
        fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status}`);
                }
                return response.json();
            })
            .then((user) => {
                messageApi.success('Успешный вход!')
                dispatch({ type: "user/setUser", payload: user });
                navigate("/app");
            })
            .catch((error) => {
                console.error('Ошибка при логине:', error);
                messageApi.error(`Ошибка при логине: ${error}`)
            });
    };

    return (
        <>
            {contextHolder}
            <CenteredContainer>
                <Form
                    name="login"
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Почта" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Пароль" />
                    </Form.Item>
                    {/* <Form.Item>
                    <Flex justify="space-between" align="center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Запомни меня</Checkbox>
                        </Form.Item>
                        <a href="">Забыл пароль</a>
                    </Flex>
                </Form.Item> */}

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Вход
                        </Button>
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <a href="" onClick={() => navigate("/registration")}>
                                Зарегистрироваться
                            </a>
                        </div>

                    </Form.Item>
                </Form>
            </CenteredContainer>
        </>
    );
}

export default Login;
