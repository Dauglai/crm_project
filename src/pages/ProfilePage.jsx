import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfilePage.css";
import {getPageCount} from "../utils/pages";

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        patronymic: "",
        work: "",
        personal: "",
        role: "",
        birthday: "",
        photo: null,
    });

    const fetchProfile = async () => {
        try {
            const response = await axios.get("http://localhost:8000/accounts/profile/", {
                withCredentials: true,
            });
            const data = response.data.results[0]; // Берем первый профиль из массива
            if (data) {
                setProfile(data);
                setFormData({
                    name: data.name || "",
                    surname: data.surname || "",
                    patronymic: data.patronymic || "",
                    work: data.work || "",
                    personal: data.personal || "",
                    role: data.role || "",
                    birthday: data.birthday || "",
                    photo: data.photo || null,
                });
            }
        } catch (err) {
            console.error("Ошибка при загрузке профиля:", err);
        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
    };

    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];

    const handleSave = () => {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        axios
            .put("http://localhost:8000/accounts/profile/update/", form, {
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true,
            })
            .then((response) => {
                setProfile(response.data);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Ошибка при обновлении профиля:", error);
            });
    };


    if (!profile) {
        return <div>Загрузка профиля...</div>;
    }

    return (
        <div className="profile-page">
            <h1>Профиль пользователя</h1>
            <div className="profile-card">
                <div className="profile-photo">
                    <img
                        src={profile.photo || "/default-profile.png"}
                        alt="Фото профиля"
                    />
                </div>
                <div className="profile-info">
                    {isEditing ? (
                        <form className="profile-form">
                            <label>
                                Имя:
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Фамилия:
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Отчество:
                                <input
                                    type="text"
                                    name="patronymic"
                                    value={formData.patronymic}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                День рождения:
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Место работы:
                                <input
                                    type="text"
                                    name="work"
                                    value={formData.work}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Роль:
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Личная информация:
                                <textarea
                                    name="personal"
                                    value={formData.personal}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Фото:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <button type="button" onClick={handleSave}>
                                Сохранить
                            </button>
                        </form>
                    ) : (
                        <div>
                            <p><strong>Имя:</strong> {profile.name}</p>
                            <p><strong>Фамилия:</strong> {profile.surname}</p>
                            <p><strong>Отчество:</strong> {profile.patronymic}</p>
                            <p><strong>День рождения:</strong> {profile.birthday}</p>
                            <p><strong>Место работы:</strong> {profile.work}</p>
                            <p><strong>Роль:</strong> {profile.role}</p>
                            <p><strong>Личная информация:</strong> {profile.personal}</p>
                            <button onClick={() => setIsEditing(true)}>Редактировать</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
