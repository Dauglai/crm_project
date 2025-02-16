import { useState, useEffect } from "react";
import axios from "axios";

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/notifications/", { withCredentials: true });
            setNotifications(response.data.results);
        } catch (error) {
            console.error("Ошибка при загрузке уведомлений:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:8000/api/notifications/${id}/`, { is_accepted: true }, { withCredentials: true });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Ошибка при отметке уведомления как прочитанного:", error);
        }
    };

    return { notifications, loading, markAsRead };
};

export default useNotifications;
