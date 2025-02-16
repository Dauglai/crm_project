import React, { useState } from "react";
import "../../styles/TaskListColumn.css";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../UI/ProfileModal/ProfileModal";
import ProfileItem from "../ProfileItem";

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

// Функция форматирования времени (HH:MM)
const formatTime = (timeStr) => {
    return timeStr ? timeStr.slice(0, 5) : "00:00";
};

// Функция форматирования даты (например, "Вторник 05.02")
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const dayName = daysOfWeek[date.getDay() - 1] || "Неизвестно";
    const dayNumber = date.getDate().toString().padStart(2, "0");
    const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${dayName} ${dayNumber}.${monthNumber}`;
};

const statusColors = {
    "На согласовании": "#ffc107",  // Желтый
    "В работе": "#007bff",         // Синий
    "Выполнена": "#28a745",        // Зеленый
    "Завершена": "#17a2b8",        // Голубой
    "Отменена": "#dc3545",         // Красный
};

const TaskListColumn = ({ tasks }) => {
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

    const tasksByDay = daysOfWeek.map((day, index) => {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + index);
        const formattedDate = currentDate.toISOString().split("T")[0];

        return {
            day: formatDate(formattedDate),
            date: formattedDate,
            tasks: tasks
                .filter(task => task.deadline === formattedDate)
                .sort((a, b) => (a.time || "").localeCompare(b.time || "")), // Сортировка по времени
        };
    });

    return (
        <div className="task-list">
            {tasksByDay.map(({ day, date, tasks }) => (
                <div key={date} className="task-day-column">
                    <h3>{day}</h3>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task.id} className="task-card-column" onClick={() => navigate("/tasks/" + task.id)}>
                                <div className="task-left">
                                    <p className="task-time">{formatTime(task.time)}</p>
                                    <p className="task-id">#{task.id}</p>
                                </div>
                                <div className="task-center">
                                    <h4>{task.name}</h4>
                                    <span
                                        className="task-status"
                                        style={{ backgroundColor: statusColors[task.status] || "#f8f9fa" }}>
                                        {task.status}
                                    </span>
                                </div>
                                <div className="task-right">
                                    <p
                                        className="task-user"
                                        onClick={(e) => showProfileModal(task.author)}
                                    >
                                        {task.author.name}
                                    </p>
                                    <p
                                        className="task-user"
                                        onClick={(e) => showProfileModal(task.addressee)}
                                    >
                                        {task.addressee.name}
                                    </p>
                                </div>
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

export default TaskListColumn;
