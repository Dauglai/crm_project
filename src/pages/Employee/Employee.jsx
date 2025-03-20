import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "../../components/UI/ProfileModal/ProfileModal";
import ProfileItem from "../../components/ProfileItem";
import MyInput from "../../components/UI/input/MyInput";
import "./Employee.css";
import DownloadEmployeeReport from "../../components/DownloadButton/DownloadEmployeeReport";
import MyButton from "../../components/UI/button/MyButton";
import MyModal from "../../components/UI/MyModal/MyModal";
import AddProfilePage from "../../components/ProfileModalCreate";

const Employee = () => {
    const [profiles, setProfiles] = useState([]);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalProfile, setModalProfile] = useState(null);
    const [userModalVisible, setUserModalVisible] = useState(false);

    const openCreateProfileModal = () => {
        setUserModalVisible(true);
    };

    useEffect(() => {
        fetchProfiles();
        const interval = setInterval(fetchProfiles, 10000); // Обновлять каждые 10 секунд
        return () => clearInterval(interval);
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get("http://localhost:8000/analytics/employees/", {
                withCredentials: true,
            });
            setProfiles(response.data.results);
        } catch (error) {
            console.error("Ошибка загрузки профилей:", error);
        }
    };

    const handleDownload = () => {
        window.location.href = "http://localhost:8000/analytics/download/";
    };

    const filteredProfiles = profiles.filter((profile) =>
        profile.name.toLowerCase().includes(search.toLowerCase()) ||
        profile.surname.toLowerCase().includes(search.toLowerCase())
    );

    const openProfile = (profile) => {
        setModalProfile(profile);
        setModalVisible(true);
    };

    return (
        <div className="employee-container">
            <div className="employee-frame">
                <h2>Список сотрудников</h2>
                <div className="filters">
                    <MyInput
                        type="text"
                        placeholder="Поиск по имени или фамилии"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <ul className="profile-list">
                    {filteredProfiles.map((profile) => (
                        <li key={profile.id} className="profile-item" onClick={() => openProfile(profile)}>
                            <img src={profile.photo} alt={`${profile.name} ${profile.surname}`}
                                 className="profile-photo"/>
                            <div className="profile-info">
                                <p>{profile.name} {profile.surname}</p>
                                <span className={profile.status === "online" ? "status-online" : "status-offline"}>
                                    {profile.status === "online" ? "В сети" : "Не в сети"}
                                </span>
                            </div>
                            <DownloadEmployeeReport profileId={profile.author.id} />
                        </li>
                    ))}
                </ul>

                <MyButton className="add-role-button" onClick={() => openCreateProfileModal()}>
                    Добавить нового сотрудника
                </MyButton>
            </div>

            {modalVisible && (
                <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
                    {modalProfile && <ProfileItem profile={modalProfile} />}
                </ProfileModal>
            )}

            {userModalVisible && (
                <MyModal visible={userModalVisible} setVisible={setUserModalVisible}>
                    <AddProfilePage/>
                </MyModal>
            )}
        </div>
    );
};

export default Employee;
