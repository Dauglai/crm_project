import React from 'react';

const EmployeeList = ({ profiles, taskData, setTaskData, field }) => {

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
            {profiles.map(user => (
                <label key={user.author.id}>
                    <input
                        type="checkbox"
                        value={user.author.id}
                        checked={(taskData[field] || []).includes(user.author.id)}
                        onChange={handleCheckboxChange}
                    />
                    {user.surname} {user.name} {user.patronymic}
                </label>
            ))}
        </div>
    );
};

export default EmployeeList;
