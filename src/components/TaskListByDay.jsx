import React, {useState} from "react";
import "../styles/TaskListByDay.css";
import {useNavigate} from "react-router-dom";
import ProfileModal from "./UI/ProfileModal/ProfileModal";
import ProfileItem from "./ProfileItem";

const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];

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

    const tasksByDay = daysOfWeek.map((day, index) => {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + index);
        const formattedDate = currentDate.toISOString().split("T")[0];

        return {
            day,
            date: formattedDate,
            tasks: tasks.filter(task => task.deadline === formattedDate),
        };
    });

    return (
        <div className="task-list-by-day">
            {tasksByDay.map(({ day, date, tasks }) => (
                <div key={date} className="task-day">
                    <h3>{day} ({date})</h3>
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task.id} className="task-card" onClick={() => navigate("/tasks/" + task.id)}>
                                <h4>{task.name}</h4>
                                <p>{task.description}</p>
                                <span className={`status ${task.status.toLowerCase()}`}>
                                    {task.status}
                                </span>
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
