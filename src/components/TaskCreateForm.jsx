import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TaskForm.css";
import ProfileModal from "./UI/ProfileModal/ProfileModal";
import EmployeeList from "./EmployeeList";
import {useNavigate} from "react-router-dom";

const TaskCreateForm = () => {
    const [profiles, setProfiles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [modalField, setModalField] = useState(""); // Для определения, какой тип пользователей выбирается в данный момент
    const [taskData, setTaskData] = useState({
        name: '',
        deadline: '',
        description: '',
        status: 'На согласовании',
        addressee: null,
        observers: [],
        coordinators: [],
    });

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('http://localhost:8000/accounts/profile/',
                { withCredentials: true });
            setProfiles(response.data.results);
        };
        fetchTasks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({
            ...prevData,
            [name]: name === "addressee" ? Number(value) : value,
        }));
    };

    const openModal = (field) => {
        setModalField(field);
        setModalVisible(true);
    };

    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/task/create/', taskData, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            alert("Task created successfully");
            navigate('/tasks');
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
                        <option key={user.author.id}
                                value={user.author.id}>{user.surname} {user.name} {user.patronymic}</option>
                    ))}
                </select>
            </fieldset>

            <div className="selection-block">
                <div>
                    <h3>Наблюдатели</h3>
                    <div className="selection-list">
                        {taskData.observers.map(id => {
                            const user = profiles.find(profile => profile.author.id === id);
                            return <div key={id}>{user ? `${user.surname} ${user.name} ${user.patronymic}` : ''}</div>;
                        })}
                    </div>
                    <button type="button" onClick={() => openModal("observers")}>Добавить наблюдателей</button>
                </div>

                <div>
                    <h3>Координаторы</h3>
                    <div className="selection-list">
                        {taskData.coordinators.map(id => {
                            const user = profiles.find(profile => profile.author.id === id);
                            return <div key={id}>{user ? `${user.surname} ${user.name} ${user.patronymic}` : ''}</div>;
                        })}
                    </div>
                    <button type="button" onClick={() => openModal("coordinators")}>Добавить координаторов</button>
                </div>
            </div>

            <button type="submit" style={{marginTop: '20px'}}>Создать задачу</button>


            <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
                <EmployeeList
                    profiles={profiles}
                    taskData={taskData}
                    setTaskData={setTaskData}
                    field={modalField}
                />
            </ProfileModal>
        </form>
    );
};

export default TaskCreateForm;
