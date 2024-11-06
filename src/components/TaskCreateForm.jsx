import React, {useEffect, useState} from "react";
import axios from "axios";
import "../styles/TaskForm.css";
import useFetching from "../hooks/useFetching";
import ProfileService from "./API/ProfileService";

const TaskCreateForm = () => {
    const [profiles, setProfiles] = useState([]);
    const [taskData, setTaskData] = useState({
        name: '',
        deadline: '',
        description: '',
        status: 'На согласовании',
        addressee: null,
        observers: [],
        coordinators: [],
    });


    const fetchTasks = async ()=> {
        const response = await axios.get('http://localhost:8000/accounts/profile/',
            {withCredentials: true});
        console.log(response.data);
        setProfiles(response.data.results);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({
            ...prevData,
            [name]: name === "addressee" ? Number(value) : value,
        }));
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setTaskData(prevData => {
            const updatedField = checked
                ? [...prevData[field], Number(value)]
                : prevData[field].filter(item => item !== Number(value));
            return { ...prevData, [field]: updatedField };
        });
    };



    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:8000/task/create/',
                taskData,
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );
            alert("Task created successfully");
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task");
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>Создание задачи</h2>

            <label>
                Название задачи:
                <input
                    type="text"
                    name="name"
                    value={taskData.name}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Ожидаемый срок выполнения:
                <input
                    type="date"
                    name="deadline"
                    value={taskData.deadline}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Описание:
                <textarea
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                />
            </label>

            <fieldset>
                <legend>Адресат</legend>
                <select
                    name="addressee"
                    value={taskData.addressee}
                    onChange={handleChange}
                >
                    <option value="">Выберите адресата</option>
                    {profiles.map(user => (
                        <option key={user.author.id} value={user.author.id}>{user.surname} {user.name} {user.patronymic}</option>
                    ))}
                </select>
            </fieldset>

            <fieldset>
                <legend>Наблюдатели</legend>
                {profiles.map(user => (
                    <label key={user.author.id}>
                        <input
                            type="checkbox"
                            value={user.author.id}
                            checked={taskData.observers.includes(user.author.id)}
                            onChange={(e) => handleCheckboxChange(e, 'observers')}
                        />
                        {user.surname} {user.name} {user.patronymic}
                    </label>
                ))}
            </fieldset>

            <fieldset>
                <legend>Согласующие</legend>
                {profiles.map(user => (
                    <label key={user.author.id}>
                        <input
                            type="checkbox"
                            value={user.author.id}
                            checked={taskData.coordinators.includes(user.author.id)}
                            onChange={(e) => handleCheckboxChange(e, 'coordinators')}
                        />
                        {user.surname} {user.name} {user.patronymic}
                    </label>
                ))}
            </fieldset>

            <button type="submit">Создать задачу</button>
        </form>
    );
};

export default TaskCreateForm;