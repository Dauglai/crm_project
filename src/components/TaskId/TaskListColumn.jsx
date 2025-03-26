import React, { useState } from "react";
import "../../styles/TaskListColumn.css";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../UI/ProfileModal/ProfileModal";
import ProfileItem from "../ProfileItem";

const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

// Функция форматирования времени (HH:MM)
const formatTime = (timeStr) => {
    return timeStr ? timeStr.slice(0, 5) : "00:00";
};

// Функция форматирования даты
const formatDate = (date) => {
    const dayName = daysOfWeek[date.getDay()];
    const dayNumber = date.getDate().toString().padStart(2, "0");
    const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${dayName} ${dayNumber}.${monthNumber}`;
};

// Цвета статусов
const statusColors = {
    "На согласовании": "#ffc107",
    "В работе": "#007bff",
    "Выполнена": "#28a745",
    "Завершена": "#17a2b8",
    "Отменена": "#dc3545",
};

const TaskListColumn = ({ tasks }) => {
    const today = new Date();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState(null);
    const navigate = useNavigate();

    const showProfileModal = (profile, event) => {
        event.stopPropagation(); // Чтобы не переходить в задачу при клике на ФИО
        setModalProfile(profile);
        setModalVisible(true);
    };

    // Формируем массив дат на сегодня, завтра и послезавтра
    const dates = [0, 1, 2].map(offset => {
        const date = new Date();
        date.setDate(today.getDate() + offset);
        return {
            dateStr: date.toISOString().split("T")[0],
            formatted: formatDate(date),
            label: offset === 0 ? "Сегодня" : offset === 1 ? "Завтра" : "Послезавтра"
        };
    });

    return (
        <div className="task-list">
            {dates.map(({ dateStr, formatted, label }) => {
                const dayTasks = tasks
                    .filter(task => task.deadline === dateStr)
                    .sort((a, b) => (a.time || "").localeCompare(b.time || "")); // Сортировка по времени

                return (
                    <div key={dateStr} className="task-day-column">
                        <h3>{label} ({formatted})</h3>
                        {dayTasks.length > 0 ? (
                            dayTasks.map(task => (
                                <div
                                    key={task.id}
                                    className="task-card-column"
                                    onClick={() => navigate("/tasks/" + task.id)}
                                    style={{borderLeft: `6px solid ${statusColors[task.status] || "#f8f9fa"}`}}
                                >
                                    <div className="task-left">
                                        <h4>#{task.id}. {task.name}</h4>
                                    </div>
                                    <div className="task-center">
                                        <h4>{task.status}</h4>
                                    </div>
                                    <div className="task-right">
                                        <p className="task-user" onClick={(e) => showProfileModal(task.author, e)}>
                                            {task.author.surname} {task.author.name} {task.author.patronymic}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-tasks">Нет задач</p>
                        )}
                    </div>
                );
            })}

            {modalVisible && (
                <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
                    {modalProfile && <ProfileItem profile={modalProfile} />}
                </ProfileModal>
            )}
        </div>
    );
};

export default TaskListColumn;
