import React from "react";
import "../RoleList/RoleList.css";

const roles = [
    { name: "Все с моим участием", value: "all" },
    { name: "Поданные мной", value: "author" },
    { name: "Адресованные мне", value: "addressee" },
    { name: "Мне на соглосование", value: "coordinator" },
    { name: "Мне на рассмотрение", value: "observer" },
];

const RoleList = ({ selectedRole, onRoleChange }) => {
    return (
        <ul className="role-list">
            {roles.map((role) => (
                <li
                    key={role.value}
                    className={`role-item ${selectedRole === role.value ? "active" : ""}`}
                    onClick={() => onRoleChange(role.value)}
                >
                    {role.name}
                </li>
            ))}
        </ul>
    );
};

export default RoleList;
