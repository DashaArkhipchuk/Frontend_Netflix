import React, { useState } from 'react';
import axios from 'axios';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Checkbox, Button, DatePicker, ConfigProvider } from 'antd';
import moment from 'moment';
import { useAuth } from '../../elements/AuthProvider';

const SignInPage = () => {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    // Стани для зберігання даних форми
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        birthDate: '',
        isActor: false,
        isCastingDirector: false
    });

    // Обробник для оновлення стану при введенні даних
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Обробник для відправки форми
    const handleSubmit = async (values) => {
        // Перш ніж відправити, перевірте значення birthDate
        console.log('Submitting values:', {
            ...formData, // Використовуйте formData, щоб включити isActor та isCastingDirector
            birthDate: moment(values.birthDate).format('YYYY-MM-DD') // Форматуємо дату тут
        });

        try {
            const response = await axios.post('https://localhost:7118/auth/register', {
                ...formData,
                birthDate: moment(values.birthDate).format('YYYY-MM-DD'), // Форматуємо перед відправкою
            });
            console.log('Registration successful', response.data);

            setToken(
                response.data.token,
                response.data.isActor,
                response.data.isCastingDirector  // note: register uses isCastingDirector
            );
            navigate('/plan');

        } catch (error) {
            console.error('Registration failed', error.response?.data);
        }
    };

    return (
        <div className={style.page}>
            <div className={style.body}>
                <div className={style.container}>
                    <div className={style.netflix}>
                        <div className={style.netflixLogo}></div>
                    </div>
                    <h1 className={style.textMain}>Sign In</h1>
                    <ConfigProvider theme={{
                        token: {
                            colorPrimary: '#800020',
                            colorBgBase: '#1f1f1f',
                            colorTextBase: '#ffffff',
                        },
                    }}>
                        <Form className='row g-1 need-validation' onFinish={handleSubmit} layout='vertical'>
                            <Form.Item
                                label="First name"
                                className={style.text}
                                name="firstName"
                                rules={[{ required: true, message: 'Please enter your first name!' }]}
                            >
                                <Input
                                    value={formData.firstName}
                                    onChange={e => handleChange({ target: { name: 'firstName', value: e.target.value } })}
                                    placeholder="Enter your first name"
                                    className={style.darkInput}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Last name"
                                className={style.text}
                                name="lastName"
                                rules={[{ required: true, message: 'Please input your last name!' }]}
                            >
                                <Input
                                    placeholder="Enter your last name"
                                    value={formData.lastName}
                                    onChange={e => handleChange({ target: { name: 'lastName', value: e.target.value } })}
                                    className={style.darkInput}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                className={style.text}
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                            >
                                <Input
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={e => handleChange({ target: { name: 'email', value: e.target.value } })}
                                    className={style.darkInput}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                className={style.text}
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={e => handleChange({ target: { name: 'password', value: e.target.value } })}
                                    className={style.darkInput}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Birth date"
                                className={style.text}
                                name="birthDate"
                                rules={[{ required: true, message: 'Please select your birth date!' }]}
                            >
                                <DatePicker
                                    value={formData.birthDate ? moment(formData.birthDate) : null}
                                    onChange={date => handleChange({ target: { name: 'birthDate', value: date ? date.format('YYYY-MM-DD') : '' } })}
                                    className={style.darkInput}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <label htmlFor="ActorOrDirector" className={`form-label ${style.textActorOrDirector}`}>
                                Choose your role (optional)
                            </label>

                            <div className="btn-group mb-3" role="group">
                                <input type="checkbox" className={`btn-check ${style.darkInput}`} id="btncheck1" name="isActor" checked={formData.isActor} onChange={handleChange} />
                                <label className={`btn btn-outline-light ${style.text}`} htmlFor="btncheck1">Actor</label>

                                <input type="checkbox" className={`btn-check ${style.darkInput}`} id="btncheck2" name="isCastingDirector" checked={formData.isCastingDirector} onChange={handleChange} />
                                <label className={`btn btn-outline-light ${style.text}`} htmlFor="btncheck2">Director</label>
                            </div>

                            <Form.Item className="col-12">
                                <Button type="primary" htmlType="submit" className={style.button}>
                                    Sign In
                                </Button>
                            </Form.Item>
                        </Form>
                    </ConfigProvider>
                </div>
            </div>
            <img src="https://deadline.com/wp-content/uploads/2023/12/BRIDGERTON_304_Unit_00626R.jpg" className={style.image} alt="netflix" />
        </div>
    );
}

export default SignInPage;
