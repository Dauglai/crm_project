import React, { useContext, useState } from 'react';
import MyInput from "../../components/UI/input/MyInput";
import MyButton from "../../components/UI/button/MyButton";
import { AuthContext } from "../../context";
import { useNavigate } from 'react-router-dom';
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { setIsAuth } = useContext(AuthContext);
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
                    'X-CSRFToken': csrfToken,
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            setIsAuth(true);
            localStorage.setItem('auth', 'true');
            navigate('/profile');

        } catch (error) {
            console.error(error);
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1 className="login-title">Вход в систему</h1>
                <MyInput
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Введите логин"
                    className="login-input"
                />
                <MyInput
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    className="login-input"
                />
                <MyButton type="submit" className="login-button">Войти</MyButton>
            </form>
            {error && <p className="login-error">{error}</p>}
        </div>
    );
};

export default Login;
