import React, { useState } from "react";
import "../../pages/TasksByDay/TaskListByDay.css";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../UI/ProfileModal/ProfileModal";
import ProfileItem from "../ProfileItem";

const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

// Определяем цвета для статусов
const statusColors = {
    "На согласовании": "#ffc107",  // Желтый
    "В работе": "#007bff",         // Синий
    "Выполнена": "#28a745",        // Зеленый
    "Завершена": "#17a2b8",        // Голубой
    "Отменена": "#dc3545",         // Красный
};

// Функция форматирования даты
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = daysOfWeek[date.getDay()];
    const dayNumber = date.getDate().toString().padStart(2, "0");
    const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${dayName} ${dayNumber}.${monthNumber}`;
};

const TaskListByDay = ({ tasks }) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState(null);
    const navigate = useNavigate();

    const showProfileModal = (profile) => {
        setModalProfile(profile);
        setModalVisible(true);
    };

    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Начало недели (понедельник)

    const tasksByDay = [...Array(5)].map((_, index) => {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + index);
        const formattedDate = currentDate.toISOString().split("T")[0];

        return {
            day: formatDate(formattedDate),
            date: formattedDate,
            tasks: tasks.filter(task => task.deadline === formattedDate),
        };
    });

    return (
        <div className="task-list-by-day">
            {tasksByDay.map(({ day, date, tasks }) => (
                <div key={date} className="task-day">
                    <h3>{day}</h3>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div
                                key={task.id}
                                className="task-card"
                                onClick={() => navigate("/tasks/" + task.id)}
                                style={{ backgroundColor: statusColors[task.status] || "#f8f9fa" }} // Цвет фона
                            >
                                <h4>#{task.id}. {task.name}</h4>
                            </div>
                        ))
                    ) : (
                        <p className="no-tasks">Нет задач</p>
                    )}
                </div>
            ))}
            {modalVisible && (
                <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
                    {modalProfile && <ProfileItem profile={modalProfile} />}
                </ProfileModal>
            )}
        </div>
    );
};

export default TaskListByDay;
