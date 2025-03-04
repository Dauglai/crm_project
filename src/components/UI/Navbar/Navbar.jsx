import React, { useState, useContext, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from "../../../context";
import MyButton from "../button/MyButton";
import "./Navbar.css";
import NotificationDropdown from "../../NotificationDropDown";
import RoleList from "../RoleList/RoleList";

function Navbar() {
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState("all");
    const navigate = useNavigate();

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

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        navigate(`/tasks?role=${role}`);
    };

    return (
        <>
            <div className="header">
                <img src={require("./margin.png")} alt="Логотип" className="header_logo"/>
                <p>MiniCRM</p>

                <button className="menu-button" onClick={toggleMenu}>
                    ☰ Меню
                </button>

                <div className="header_nav">
                    <ul className="header__list">
                        <li className="header__list-item">
                            <Link to="/profile">Профиль</Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-icons">
                    <button className="notification-icon" onClick={() => setDropdownVisible(!dropdownVisible)}>
                        🔔
                    </button>
                    {dropdownVisible && <NotificationDropdown/>}
                </div>

                <div className="header_button">
                    <MyButton onClick={handleLogout}>Выйти</MyButton>
                </div>
            </div>

            {/* Выдвижное меню */}
            <div className={`side-menu ${showMenu ? "open" : ""}`}>
                <ul className="nav-list">
                    {/* --- Раздел "Задачи" --- */}
                    <li className="menu-section-title">Задачи</li>
                    <RoleList selectedRole={selectedRole} onRoleChange={handleRoleChange}/>
                    <li><Link to="/tasks_by_day">Мои задачи по дням</Link></li>
                    <li><Link to="/tasks/create">Создать задачу</Link></li>

                    {/* --- Раздел "Справочники" --- */}
                    <li className="menu-section-title">Справочники</li>
                    <li><Link to="/products">Номенклатура</Link></li>
                    <li><Link to="/outlets">Торговые точки</Link></li>
                    <li><Link to="/settings">Настройки</Link></li>
                </ul>
            </div>

        </>
    );
}

export default Navbar;
