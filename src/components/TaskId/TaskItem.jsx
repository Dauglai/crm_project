import React, { useState } from 'react';
import ProfileItem from "../ProfileItem";
import ProfileModal from "../UI/ProfileModal/ProfileModal";
import "../../styles/App.css";
import { useNavigate } from "react-router-dom";

const TaskItem = (props) => {
    const { task } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState(null);
    const navigate = useNavigate();

    const showProfileModal = (profile) => {
        setModalProfile(profile);
        setModalVisible(true);
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (person) => {
        // Проверяем, что person существует и поля name/patronymic заданы
        if (!person) return '';
        const nameInitial = person.name ? person.name[0] + '.' : '';
        const patronymicInitial = person.patronymic ? person.patronymic[0] + '.' : '';
        return `${person.surname} ${nameInitial} ${patronymicInitial}`.trim();
    };

    return (
        <>
            <tr key={task.id}>
                <td>{task.id}</td>
                <td className="clickable-name" onClick={() => navigate("/tasks/" + task.id)}>
                    {task.name}
                </td>
                <td className="clickable-name" onClick={() => showProfileModal(task.author)}>
                    {task.author ? getInitials(task.author) : 'Автор не указан'}
                </td>
                <td className="clickable-name" onClick={() => showProfileModal(task.addressee)}>
                    {task.addressee ? getInitials(task.addressee) : 'Исполнитель не назначен'}
                </td>
                <td>{task.status}</td>
                <td>{task.deadline}</td>
                <td>{formatDateTime(task.datetime)}</td>
            </tr>
            {modalVisible && (
                <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
                    {modalProfile && <ProfileItem profile={modalProfile} />}
                </ProfileModal>
            )}
        </>
    );
};

export default TaskItem;
