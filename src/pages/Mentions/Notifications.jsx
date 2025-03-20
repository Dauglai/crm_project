import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";
import api from "../../configs/api";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/notifications/", {
                withCredentials: true,
            });
            setNotifications(response.data.results);
        } catch (error) {
            console.error("Ошибка загрузки уведомлений", error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/`, { is_accepted: true });
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, is_accepted: true } : notif
                )
            );
        } catch (error) {
            console.error("Ошибка при обновлении уведомления", error);
        }
    };

    const filteredNotifications = notifications.filter((notif) =>
        notif.comment_text.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="notifications-container">
            <h2>Уведомления о запросах</h2>
            <input
                type="text"
                placeholder="Поиск по комментариям..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />
            <ul className="notifications-list">
                {filteredNotifications.map((notif) => (
                    <li
                        key={notif.id}
                        className={`notification-item ${notif.is_accepted ? "viewed" : "unviewed"}`}
                    >
                        <div
                            onClick={() => navigate(`/tasks/${notif.task_id}`)}
                            className="notif-content"
                        >
                            <div className="notif-header">
                                <span className="notif-user">{notif.comment.owner.surname} {notif.comment.owner.name}</span>
                                <span className="notif-time">{new Date(notif.created_at).toLocaleString()}</span>
                            </div>
                            <p className="comment-text">{notif.comment_text}</p>
                        </div>
                        {!notif.is_accepted && (
                            <button className="mark-read-btn" onClick={() => markAsRead(notif.id)}>
                                Прочитано
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationsPage;
