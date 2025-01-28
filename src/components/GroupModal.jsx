import React, {useEffect, useState} from "react";
import GroupService from "./API/GroupService";
import '../styles/Group.css';

const GroupModal = ({ formData, setFormData, editingGroupId, setEditingGroupId, closeModal, refreshGroups }) => {
    const groupService = new GroupService('http://localhost:8000');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGroupId) {
                await groupService.updateGroup(editingGroupId, formData);
            } else {
                await groupService.createGroup(formData);
            }
            setFormData({ name: '' });
            setEditingGroupId(null);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="group-form">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Название группы"
                required
            />
            <button type="submit">
                {editingGroupId ? 'Обновить' : 'Добавить'}
            </button>
        </form>
    );
};

export default GroupModal;
