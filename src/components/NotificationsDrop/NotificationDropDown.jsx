import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotificationDropdown.css";

const NotificationsDrop = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/api/notifications/");
            setNotifications([...response.data.mentions, ...response.data.tasks]);
        } catch (error) {
            console.error("Ошибка загрузки уведомлений", error);
        }
    };

    return (
        <div className="notifications-dropdown">
            {notifications.length > 0 ? (
                <ul className="notification-list">
                    {notifications.map((notif, index) => (
                        <li key={index} className={`notification-item ${notif.is_accepted ? "viewed" : "unviewed"}`}>
                            <p>{notif.comment_text || `Изменение статуса: ${notif.title} → ${notif.status}`}</p>
                            <p className="timestamp">{new Date(notif.created_at || notif.updated_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-notifications">Нет новых уведомлений</p>
            )}
        </div>
    );
};

export default NotificationsDrop;
