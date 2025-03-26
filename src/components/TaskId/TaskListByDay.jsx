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
const formatDate = (date) => {
    const dayName = daysOfWeek[date.getDay()];
    const dayNumber = date.getDate().toString().padStart(2, "0");
    const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${dayName} ${dayNumber}.${monthNumber}`;
};

const TaskListByDay = ({ tasks }) => {
    const today = new Date();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState(null);
    const navigate = useNavigate();

    const showProfileModal = (profile) => {
        setModalProfile(profile);
        setModalVisible(true);
    };

    // Получаем даты на сегодня, завтра и послезавтра
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
        <div className="task-list-by-day">
            {dates.map(({ dateStr, formatted, label }) => {
                const dayTasks = tasks.filter(task => task.deadline === dateStr);

                return (
                    <div key={dateStr} className="task-day">
                        <h3>{label} ({formatted})</h3>
                        {dayTasks.length > 0 ? (
                            dayTasks.map(task => (
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


export default TaskListByDay;
