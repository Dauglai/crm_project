import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from "../../context";
import MyButton from "./button/MyButton";

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
        <div className='navbar'>
            <MyButton onClick={handleLogout}>
                Выйти
            </MyButton>
            <div className='navbar__links'>
                <Link to='/posts'>Posts</Link>
                <Link to='/about'>About</Link>
            </div>
        </div>
    )
};

export default Navbar;