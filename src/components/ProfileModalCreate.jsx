import React, { useState } from 'react';
import axios from 'axios';

const AddProfilePage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        phone: '',
    });

    const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken'))
        ?.split('=')[1];

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Обработчик изменения формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/accounts/create_profile/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log('Профиль создан', response.data);
            setFormData({
                email: '',
                password: '',
                name: '',
                surname: '',
                phone: '',
            });
        } catch (error) {
            console.error('Ошибка при создании профиля:', error);
            setError('Произошла ошибка при создании профиля. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-profile-page">
            <h2>Добавить новый профиль</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Электронная почта:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Пароль:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Телефон:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Создание...' : 'Создать профиль'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProfilePage;