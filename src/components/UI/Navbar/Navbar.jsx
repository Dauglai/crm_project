import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context";
import MyButton from "../button/MyButton";
import "./Navbar.css";

function Navbar() {
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown") && !event.target.closest(".tasks-menu")) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsAuth(false);
        localStorage.removeItem("auth");
        fetch("http://localhost:8000/api-auth/logout/", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("User logged out");
                }
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    return (
        <>
            <div className="header">
                <img src={require("./margin.png")} alt="Логотип" className="header_logo"/>
                <p>MiniCRM</p>

                <button className="menu-button" onClick={() => setShowMenu(true)}>
                    ☰ Меню
                </button>

                <div className="header_nav">
                    <ul className="header__list">
                        <li className="header__list-item">
                            <Link to="/about">Главная</Link>
                        </li>
                        <li
                            className="header__list-item tasks-menu"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <Link to="/tasks">Задачи</Link>
                            {showDropdown && (
                                <ul className="dropdown">
                                    <li><Link to="/tasks_by_day">Мои задачи по дням</Link></li>
                                    <li><Link to="/tasks">Все задачи</Link></li>
                                    <li><Link to="/tasks/create">Создать задачу</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="header__list-item">
                            <Link to="/profile">Профиль</Link>
                        </li>
                    </ul>
                </div>

                <div className="header_button">
                    <MyButton onClick={handleLogout}>Выйти</MyButton>
                </div>
            </div>

            {/* Выдвижное меню */}
            <div className={`side-menu ${showMenu ? "open" : ""}`}>
                <button className="close-button" onClick={() => setShowMenu(false)}>×</button>
                <ul>
                    <li><Link to="/products">Номенклатура</Link></li>
                    <li><Link to="/catalog">Каталог</Link></li>
                    <li><Link to="/settings">Настройки</Link></li>
                </ul>
            </div>

            {/* Затемнение фона */}
            <div className={`overlay ${showMenu ? "active" : ""}`} onClick={() => setShowMenu(false)}></div>
        </>
    );
}

export default Navbar;
