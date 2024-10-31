import React, { useState } from 'react';
import ProfileItem from "./ProfileItem";
import ProfileModal from "./UI/ProfileModal/ProfileModal";
import "../styles/App.css";

const TaskItem = (props) => {
    const { task } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState(null);

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

    return (
        <>
            <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td className="clickable-name" onClick={() => showProfileModal(task.author)}>
                    {task.author ? `${task.author.surname} ${task.author.name} ${task.author.patronymic}` : 'Автор не указан'}
                </td>
                <td className="clickable-name" onClick={() => showProfileModal(task.addressee)}>
                    {task.addressee ? `${task.addressee.surname} ${task.addressee.name} ${task.addressee.patronymic}` : 'Исполнитель не назначен'}
                </td>
                <td>{task.status}</td>
                <td>{task.deadline}</td>
                <td>{formatDateTime(task.datetime)}</td>
            </tr>

            {/* Модальное окно, вынесенное за пределы <tr> */}
            {modalVisible && (
                <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
                    {modalProfile && <ProfileItem profile={modalProfile} />}
                </ProfileModal>
            )}
        </>
    );
};

export default TaskItem;
