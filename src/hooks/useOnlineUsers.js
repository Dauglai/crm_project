import { useEffect, useState } from "react";
import axios from "axios";
import api from "../configs/api";

const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const fetchOnlineUsers = async () => {
            try {
                const response = await api.get("/online_users/");
                setOnlineUsers(response.data);
            } catch (error) {
                console.error("Ошибка получения списка онлайн пользователей", error);
            }
        };

        fetchOnlineUsers();
        const interval = setInterval(fetchOnlineUsers, 10000); // Обновляем каждые 10 сек

        return () => clearInterval(interval);
    }, []);

    return onlineUsers;
};

export default useOnlineUsers;