import React, {useContext, useState} from 'react';
import MyInput from "../components/UI/input/MyInput";
import MyButton from "../components/UI/button/MyButton";
import {AuthContext} from "../context";
import axios from "axios";
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const {setIsAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    function getCSRFToken() {
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken'))
            ?.split('=')[1];
        return csrfToken;
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        const csrfToken = getCSRFToken();

        try {
            const response = await fetch('http://localhost:8000/api-auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,  // Передача CSRF-токена
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                }),
                credentials: 'include'  // Включаем отправку cookies (важно для сессий)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('User logged in:', data);

            // Успешная аутентификация
            setIsAuth(true);
            localStorage.setItem('auth', 'true');
            navigate('/posts');  // Перенаправляем на страницу "posts"

        } catch (error) {
            console.error(error);
            setError('Invalid credentials');
        }
    };

    const log = event => {
        event.preventDefault();
        setIsAuth(true);
        localStorage.setItem('auth', 'true')
    }


    return (
        <div>
            <h1>Страница для логина</h1>
            <form onSubmit={handleLogin}>
                <MyInput
                    type="text"
                    value={username}
                    onChange={e=>setUsername(e.target.value)}
                    placeholder="Введите логин"
                />
                <MyInput
                    type="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="Введите пароль"
                />
                <MyButton type="submit">Войти</MyButton>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;