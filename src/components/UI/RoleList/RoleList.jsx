import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import "../RoleList/RoleList.css";

const roles = [
    { name: "Все с моим участием", value: "all" },
    { name: "Поданные мной", value: "author" },
    { name: "Адресованные мне", value: "addressee" },
    { name: "Мне на согласование", value: "coordinator" },
    { name: "Мне на рассмотрение", value: "observer" },
];

const RoleList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedRole = searchParams.get("role") || "all";
    const navigate = useNavigate();

    const handleRoleChange = (role) => {
        setSearchParams({ role });
        navigate(`/tasks?role=${role}`);
    };

    return (
        <ul className="role-list">
            {roles.map((role) => (
                <li
                    key={role.value}
                    className={`role-item ${selectedRole === role.value ? "active" : ""}`}
                    onClick={() => handleRoleChange(role.value)}
                >
                    {role.name}
                </li>
            ))}
        </ul>
    );
};

export default RoleList;
