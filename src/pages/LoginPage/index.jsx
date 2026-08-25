import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './style.module.scss';
import { Form, Input, Checkbox, Button, ConfigProvider } from 'antd';
import { useAuth } from '../../elements/AuthProvider';
import { useError } from '../../tools/errorContext';
import { handleApiError } from '../../tools/handleApiError';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { addError } = useError();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleSignIn = async (values) => {
        try {
            const response = await axios.post('https://localhost:7118/auth/login', {
                email: values.email,
                password: values.password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                setToken(
                    response.data.token,
                    response.data.isActor,
                    response.data.isCastingDirector
                );
                navigate('/');
            }
        } catch (error) {
            const data = error.response?.data;
            console.error('Login error:', error);
            handleApiError(error, addError);
        }
    };

    const handleSignUp = () => {
        navigate('/sign-in');
    };

    return (
        <div className={style.page}>
            <div className={style.body}>
                <div className={style.container}>
                    <div className={style.netflix}>
                        <div className={style.netflixLogo}></div>
                    </div>
                    <h1 className={style.textMain}>Welcome back</h1>
                    <p className={style.textMain} style={{ marginTop: '1rem' }}>
                        The sooner you turn on Netflix, the sooner you get a ticket to the world of entertainment!
                    </p>
                    <ConfigProvider theme={{
                        token: {
                            colorPrimary: '#800020',
                            // colorBgBase: '#1f1f1f',
                            colorTextBase: '#ffffff',
                        },
                    }}>

                        <Form onFinish={handleSignIn} layout='vertical'>
                            <Form.Item
                                label="Email"
                                className={style.text}
                                name="email"
                                rules={[{ required: true, message: 'Please enter your email!' }]}
                            >
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={style.darkInput}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                className={style.text}
                                name="password"
                                rules={[{ required: true, message: 'Please enter your password!' }]}
                            >
                                <Input.Password
                                    id="passwordInput"
                                    className={style.darkInput}
                                    aria-describedby="passwordHelpBlock"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item className="col-12" valuePropName="checked">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <Checkbox id="gridCheck" className={style.darkInput}>
                                        <span className={style.textLast}>Remember me</span>
                                    </Checkbox>
                                    <span className={style.textLast}>
                                        Forgot Password?
                                    </span>
                                </div>
                            </Form.Item>

                            <Form.Item className="col-12">
                                <Button type="primary" htmlType="submit" className={style.button}>
                                    Sign In
                                </Button>
                            </Form.Item>
                            <Form.Item className="col-12">
                                <Button type="default" className={style.button2}>
                                    <div className={style.googleLogo}></div>
                                    <p style={{ margin: 0 }}>Sign In with Google</p>
                                </Button>
                            </Form.Item>
                        </Form>

                    </ConfigProvider>
                    <div className={style.theString}>
                        <p className={style.string}>Don't have an account? <span className={style.link} onClick={handleSignUp}>Sign In</span> </p>
                    </div>
                </div>
            </div>
            <img src="https://deadline.com/wp-content/uploads/2023/12/BRIDGERTON_304_Unit_00626R.jpg" className={style.image} alt="netflix" />
        </div>
    );
};

export default LoginPage;
