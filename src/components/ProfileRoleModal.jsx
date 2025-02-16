import React, { useState, useEffect } from 'react';
import MyModal from '../components/UI/MyModal/MyModal';
import MyButton from '../components/UI/button/MyButton';
import axios from "axios";
import RoleService from '../components/API/RoleService';

const ProfileRoleModal = ({ outlets, formData, setFormData, editingId, closeModal, refreshRoles }) => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [selectedRole, setSelectedRole] = useState('Продавец');
    const roleService = new RoleService('http://localhost:8000');



    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('http://localhost:8000/accounts/search_profiles/', {
                withCredentials: true,
            });
            setProfiles(response.data.results);
        };
        fetchTasks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await roleService.updateRole(editingId, formData);
            } else {
                await roleService.createRole(formData);
            }
            refreshRoles();
            closeModal();
        } catch (error) {
            console.error("Ошибка сохранения роли", error);
        }
    };

    return (
        <form className="modal-overlay">
            <h3>Назначить роль</h3>
            <div className="form-group">
                <label>Выберите торговую точку:</label>
                <select
                    name="outlet"
                    value={formData.outlet || ''}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите торговую точку</option>
                    {outlets.length > 0 ? (
                        outlets.map(outlet => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>Загрузка...</option>
                    )}
                </select>
            </div>
            <div className="form-group">
                <label>Выберите пользователя:</label>
                <select name="profile" value={formData.profile} onChange={handleInputChange}>
                    <option value="">Выберите пользователя</option>
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <option key={profile.author.id} value={profile.author.id}>
                                {profile.surname} {profile.name} {profile.patronymic}
                            </option>
                        ))
                    ) : (
                        <option disabled>Загрузка...</option>
                    )}
                </select>
            </div>
            <div className="form-group">
                <label>Роль:</label>
                <select
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                >
                    <option value="Продавец">Продавец</option>
                    <option value="Администратор">Администратор</option>
                </select>
            </div>
            <div className="form-buttons" style={{justifyContent: 'space-between'}}>
                <MyButton onClick={handleSave}>{editingId ? "Обновить" : "Добавить"}</MyButton>
                <MyButton className="cancel-button" onClick={closeModal}>Отмена</MyButton>
            </div>
        </form>
    );
};

export default ProfileRoleModal;
