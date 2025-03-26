import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Создаем контекст
export const AuthContext = createContext(null);

// Провайдер аутентификации
export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get("http://localhost:8000/accounts/profile/", { withCredentials: true });
                console.log("🔹 Профиль загружен:", response.data);
                setUserProfile(response.data.results); // Устанавливаем профиль
            } catch (error) {
                console.error("❌ Ошибка загрузки профиля:", error);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ userProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для использования AuthContext в компонентах
export const useAuth = () => useContext(AuthContext);
