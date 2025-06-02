import React from "react";
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import CenteredContainer from "src/additional/centeredContainer";
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values: any) => {
        fetch(`/api/auth/registration`, {
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
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.error('Ошибка при регистрации:', error);
                messageApi.error(`Ошибка при регистрации: ${error}`);
            });
    };

    return (
        <>
            {contextHolder}
            <CenteredContainer>
                <Form
                    name="registration"
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="fio"
                        rules={[{ required: true, message: 'Пожалуйста введите свое фио!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="ФИО" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'Введенная почта не валидна!',
                            },
                            {
                                required: true,
                                message: 'Пожалуйста введите свою почту!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Почта" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста введите свой пароль!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item
                        name="confirm_password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста подвердите свой пароль!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Данный пароль не совпадает с введенным выше!'));
                                },
                            }),
                        ]}
                    >
                        <Input prefix={<LockOutlined />} type="password" placeholder="Подтверждение пароля" />
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Отправить
                        </Button>
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                                Перейти на страницу входа
                            </a>
                        </div>
                    </Form.Item>
                </Form>
            </CenteredContainer>
        </>
    )
}

export default Registration;
