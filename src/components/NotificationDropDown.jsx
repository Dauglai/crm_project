import React from "react";
import { Link } from "react-router-dom";

import "./NotificationDropdown.css";
import useNotifications from "../hooks/useNotifications";

const NotificationDropdown = () => {
    const { notifications, loading, markAsRead } = useNotifications();

    return (
        <div className="notification-dropdown">
            <h3>Уведомления</h3>
            {loading ? (
                <p>Загрузка...</p>
            ) : notifications.length > 0 ? (
                <div className="notification-list">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="notification-item">
                            <p>{notif.comment_text}</p>
                            <Link to={`/tasks/${notif.task_id}`} onClick={() => markAsRead(notif.id)}>
                                Перейти к задаче
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Нет новых уведомлений</p>
            )}
        </div>
    );
};

export default NotificationDropdown;
