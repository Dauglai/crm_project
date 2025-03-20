import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true, // Нужно для передачи куков (включая CSRF-токен)
});

// Получение CSRF-токена из cookie и установка в заголовки
api.interceptors.request.use((config) => {
    const csrftoken = getCookie("csrftoken"); // Функция для получения CSRF из cookie
    if (csrftoken) {
        config.headers["X-CSRFToken"] = csrftoken;
    }
    return config;
});

// Функция получения CSRF-токена из cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default api;
