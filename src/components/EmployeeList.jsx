import React, { useState } from 'react';
import MyInput from "./UI/input/MyInput";

const EmployeeList = ({ profiles = [], taskData, setTaskData, field }) => {
    const [filter, setFilter] = useState({ query: '' });

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numValue = Number(value);
        setTaskData(prevData => {
            const updatedField = checked
                ? [...(prevData[field] || []), numValue]
                : (prevData[field] || []).filter(item => item !== numValue);
            return { ...prevData, [field]: updatedField };
        });
    };

    return (
        <div>
            <h3>Выберите {field === 'observers' ? 'наблюдателей' : 'координаторов'}</h3>
            <MyInput
                value={filter.query}
                onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                placeholder="Поиск"
            />
            {profiles.length > 0 ? (
                profiles.map(user => (
                    user.author ? (
                        <label key={user.author.id}>
                            <MyInput
                                type="checkbox"
                                value={user.author.id}
                                checked={(taskData[field] || []).includes(user.author.id)}
                                onChange={handleCheckboxChange}
                            />
                            {user.surname} {user.name} {user.patronymic}
                        </label>
                    ) : null
                ))
            ) : (
                <p>Нет доступных сотрудников</p>
            )}
        </div>
    );
};

export default EmployeeList;