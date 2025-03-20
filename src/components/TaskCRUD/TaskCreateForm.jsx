import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/TaskForm.css";
import ProfileModal from "../UI/ProfileModal/ProfileModal";
import EmployeeList from "../Employee/EmployeeList";
import {useNavigate, useSearchParams} from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TaskEditor from "./TaskEditor";

const TaskCreateForm = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId") || null;
    const [profiles, setProfiles] = useState([]);
    const [profile, setProfile] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [modalField, setModalField] = useState("");
    const [taskData, setTaskData] = useState({
        name: '',
        deadline: '',
        description: '',
        status: 'На согласовании',
        addressee: null,
        observers: [],
        coordinators: [],
        file: null,
        order: orderId,
    });

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('http://localhost:8000/accounts/search_profiles/', {
                withCredentials: true,
            });
            setProfiles(response.data.results);
        };
        fetchTasks();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get("http://localhost:8000/accounts/profile/", {
                withCredentials: true,
            });
            const data = response.data.results[0]; //первый профиль из массива
            if (data) {
                setProfile(data);
            }
        } catch (err) {
            console.error("Ошибка при загрузке профиля:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prevData) => ({
            ...prevData,
            [name]: name === "addressee" ? Number(value) : value,
        }));
    };

    const handleFileChange = (e) => {
        setTaskData((prev) => ({ ...prev, file: e.target.files[0] }));
    };

    const openModal = (field) => {
        setModalField(field);
        setModalVisible(true);
    };

    const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"))
        ?.split("=")[1];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Создаём объект FormData
        const formData = new FormData();
        formData.append("name", taskData.name);
        formData.append("deadline", taskData.deadline);
        formData.append("description", taskData.description);
        formData.append("status", taskData.status);
        formData.append("addressee", taskData.addressee);
        if (taskData.file) {
            formData.append("file", taskData.file);
        }
        if (orderId) {
            formData.append("order", orderId);
        }

        // Добавляем массивы (наблюдателей и координаторов)
        taskData.observers.forEach((observer) => formData.append("observers", observer));
        taskData.coordinators.forEach((coordinator) => formData.append("coordinators", coordinator));

        try {
            const response = await axios.post("http://localhost:8000/task/create/", formData, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.status === 201) {
                if (orderId) {
                    navigate(`/orders/${orderId}`);
                }
                else navigate(`/tasks/${response.data.id}`);
            }

            else {
                throw new Error("Unexpected response status: " + response.status);
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>Создание задачи</h2>
            <div className="form-row">
                <div className="form-block">
                    <div>
                        <h3>Автор</h3>
                        <p>{profile.surname} {profile.name} {profile.patronymic}</p>
                    </div>
                </div>


                <div className="form-block">
                    <div className="form-header">
                        <h3>Адресат</h3>
                        <img
                            src="/images/icons/add_user.svg"
                            alt="Добавить адресата"
                            className="add-user-icon"
                            onClick={() => openModal("addressee")}
                        />
                    </div>
                    <div className="selection-list">
                        {taskData.addressee && taskData.addressee.length > 0 ? (
                            (() => {
                                const user = profiles.find(
                                    (profile) => profile.author.id === taskData.addressee[0]
                                );
                                return (
                                    <div key={user?.author.id}>
                                        {user
                                            ? `${user.surname} ${user.name} ${user.patronymic}`
                                            : "Пользователь не найден"}
                                    </div>
                                );
                            })()
                        ) : (
                            <div>Адресат не выбран</div>
                        )}
                    </div>
                </div>

                <div className="form-block">
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
                </div>
            </div>
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
            <TaskEditor taskData={taskData} setTaskData={setTaskData}/>

            <div className="form-row">
                <div className="form-block">
                    <label>
                        Прикрепить файл:
                        <input type="file" accept="*" onChange={handleFileChange}/>
                    </label>
                </div>

                <div className="form-block">
                    <div className="form-header">
                        <h3>Согласователи</h3>
                        <img
                            src="/images/icons/add_user.svg"
                            alt="Добавить соглосователя"
                            className="add-user-icon"
                            onClick={() => openModal("coordinators")}
                        />
                    </div>
                    <div className="selection-list">
                        {taskData.coordinators.map((id) => {
                            const user = profiles.find((profile) => profile.author.id === id);
                            return (
                                <div key={id}>
                                    {user ? `${user.surname} ${user.name} ${user.patronymic}` : ""}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="form-block">
                    <div className="form-header">
                        <h3>Наблюдатели</h3>
                        <img
                            src="/images/icons/add_user.svg"
                            alt="Добавить наблюдателя"
                            className="add-user-icon"
                            onClick={() => openModal("observers")}
                        />
                    </div>
                    <div className="selection-list">
                        {taskData.observers.map((id) => {
                            const user = profiles.find((profile) => profile.author.id === id);
                            return (
                                <div key={id}>
                                    {user ? `${user.surname} ${user.name} ${user.patronymic}` : ""}
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>

            <button type="submit">Создать задачу</button>
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
