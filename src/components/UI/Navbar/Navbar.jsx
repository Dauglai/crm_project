import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../../../context";
import MyButton from "../button/MyButton";
import "./Navbar.css"

function Navbar() {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('auth')
    }
    const handleLogout = () => {
        setIsAuth(false);
        localStorage.removeItem('auth')
        fetch('http://localhost:8000/api-auth/logout/', {
            method: 'POST',
            credentials: 'include',  // Важно для завершения сессии
        })
            .then(response => {
                if (response.ok) {
                    console.log('User logged out');
                }
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <div className="header">
            <img src={require('./margin.png')} alt="Логотип" className="header_logo"/>
            <p>MiniCRM</p>
            <nav className='header_nav'>
                <ul className="header__list">
                    <li className="header__list-item"><Link to='/about'>Главная</Link></li>
                    <li className="header__list-item"><Link to='/tasks'>Задачи</Link></li>
                    <li className="header__list-item"><Link to='/profile'>Профиль</Link></li>
                </ul>
            </nav>

            <div className="header_button">
                <MyButton onClick={handleLogout}>Выйти</MyButton>
            </div>
        </div>
    )
};

export default Navbar ;