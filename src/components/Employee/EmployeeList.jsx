import React, { useState } from "react";
import MyInput from "../UI/input/MyInput";
import "./EmployeeList.css";

const EmployeeList = ({ profiles = [], taskData, setTaskData, field }) => {
    const [filter, setFilter] = useState("");

    // Фильтрация списка по фамилии, имени или отчеству
    const filteredProfiles = profiles.filter(user => {
        const fullName = `${user.surname} ${user.name} ${user.patronymic}`.toLowerCase();
        return fullName.includes(filter.toLowerCase());
    });

    // Обработчик выбора сотрудника
    const handleSelect = (userId) => {
        setTaskData((prevData) => {
            const isSelected = (prevData[field] || []).includes(userId);
            const updatedField = isSelected
                ? prevData[field].filter(id => id !== userId)
                : [...(prevData[field] || []), userId];
            return { ...prevData, [field]: updatedField };
        });
    };

    return (
        <div className="employee-list">
            <h3>Выберите {field === "observers" ? "наблюдателей"  : "coordinators" ? "координаторов": "адресата"}</h3>
            <MyInput
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Поиск по ФИО"
                className="search-input"
            />

            {filteredProfiles.length > 0 ? (
                <div className="employee-container">
                    {filteredProfiles.map(user => user.author ? (
                        <div
                            key={user.author.id}
                            className={`employee-item ${taskData[field]?.includes(user.author.id) ? "selected" : ""}`}
                            onClick={() => handleSelect(user.author.id)}
                        >
                            <img src={user.photo || "/default-avatar.png"} alt="Фото" className="employee-photo" />
                            <span className="employee-name">
                                {user.surname} {user.name} {user.patronymic}
                            </span>
                        </div>
                        ) : null
                    )}
                </div>
            ) : (
                <p className="no-employees">Нет доступных сотрудников</p>
            )}
        </div>
    );
};

export default EmployeeList;
