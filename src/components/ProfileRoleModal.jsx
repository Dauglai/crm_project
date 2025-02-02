import React, { useState, useEffect } from 'react';
import MyModal from '../components/UI/MyModal/MyModal';
import MyButton from '../components/UI/button/MyButton';
import axios from "axios";
import RoleService from '../components/API/RoleService';

const ProfileRoleModal = ({ visible, setVisible, outlet, refreshRoles, closeModal }) => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [selectedRole, setSelectedRole] = useState('Продавец');
    const roleService = new RoleService('http://localhost:8000');

    useEffect(() => {
        if (visible) {
            fetchProfiles();
        }
    }, [visible]);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('http://localhost:8000/accounts/profile/', {
                withCredentials: true,
            });
            setProfiles(response.data.results);
        } catch (error) {
            console.error("Ошибка загрузки пользователей", error);
        }
    };

    const handleSave = async () => {
        if (!selectedProfile || !outlet) return;
        try {
            await roleService.createRole({
                profile: selectedProfile,
                outlet: outlet.id,
                name: selectedRole,
            });
            refreshRoles();
            setVisible(false);
            closeModal();
        } catch (error) {
            console.error("Ошибка сохранения роли", error);
        }
    };

    return (
        <MyModal visible={visible} setVisible={setVisible}>
            <h3>Назначить роль</h3>
            <div className="form-group">
                <label>Выберите пользователя:</label>
                <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                >
                    <option value="">Выберите пользователя</option>
                    {profiles.map(profile => (
                        <option key={profile.id} value={profile.id}>
                            {profile.surname} {profile.name} {profile.patronymic}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Роль:</label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="Продавец">Продавец</option>
                    <option value="Администратор">Администратор</option>
                </select>
            </div>
            <div className="form-buttons" style={{ justifyContent: 'space-between' }}>
                <MyButton onClick={handleSave}>Сохранить</MyButton>
                <MyButton className="cancel-button" onClick={() => setVisible(false)}>Отмена</MyButton>
            </div>
        </MyModal>
    );
};

export default ProfileRoleModal;
