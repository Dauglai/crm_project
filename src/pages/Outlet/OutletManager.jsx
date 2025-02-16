import React, { useState, useEffect } from 'react';
import OutletService from '../../components/API/OutletService';
import RoleService from '../../components/API/RoleService';
import './OutletManager.css';
import MyModal from '../../components/UI/MyModal/MyModal';
import OutletsFormModal from '../../components/Outlets/OutletsFormModal';
import MyButton from '../../components/UI/button/MyButton';
import ProfileRoleModal from '../../components/ProfileRoleModal';
import ProfileModal from "../../components/UI/ProfileModal/ProfileModal";
import ProfileItem from "../../components/ProfileItem";
import AddProfilePage from "../../components/ProfileModalCreate";


const OutletsManager = () => {
    const outletService = new OutletService('http://localhost:8000');
    const roleService = new RoleService('http://localhost:8000');

    const [outlets, setOutlets] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [outletModalVisible, setOutletModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [editingOutlet, setEditingOutlet] = useState(null);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [modalProfile, setModalProfile] = useState(null);
    const [roleFormData, setRoleFormData] = useState({
        profile: '',
        name: 'Продавец',
        outlet: ''
    });
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchOutlets();
    }, []);

    useEffect(() => {
        if (selectedOutlet?.id) {
            fetchRoles(selectedOutlet.id);
        }
    }, [selectedOutlet]);

    const fetchOutlets = async () => {
        try {
            const response = await outletService.fetchOutlets();
            setOutlets(response);
        } catch (error) {
            console.error("Error fetching outlets:", error);
        }
    };

    const fetchRoles = async (outletId) => {
        if (!outletId) return;
        try {
            const response = await roleService.fetchRoles({ outlet: outletId });
            setRoles(response);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const openOutletModal = (outlet = null) => {
        setEditingOutlet(outlet);
        setOutletModalVisible(true);
    };

    const closeOutletModal = () => {
        setEditingOutlet(null);
        setOutletModalVisible(false);
    };

    const showRoleModal = (role = null) => {
        if (role) {
            setEditingRole(role.id);
            setRoleFormData({
                profile: role.worker,
                name: role.name,
                outlet: role.outlet
            });
        } else {
            setEditingRole(null);
            setRoleFormData({
                profile: '',
                name: 'Продавец',
                outlet: selectedOutlet? selectedOutlet.id : '',
            });
        }
        setRoleModalVisible(true);
    };

    const openCreateProfileModal = () => {
        setUserModalVisible(true);
    };

    const showProfileModal = (profile) => {
        setModalProfile(profile);
        setProfileModalVisible(true);
    };

    const closeRoleModal = () => {
        setEditingRole(null);
        setRoleModalVisible(false);
    };

    return (
        <div className="outlets-manager">
            <h2>Управление Торговыми точками</h2>
            <div className="outlets-container">
                <div className="outlets-list">
                    {outlets.map((outlet) => (
                        <div
                            key={outlet.id}
                            className={`outlet-item ${selectedOutlet?.id === outlet.id ? 'selected' : ''}`}
                            onClick={() => setSelectedOutlet(outlet)}
                        >
                            <h3>{outlet.name}</h3>
                            <p className="outlet-address">{outlet.address}</p>
                        </div>
                    ))}
                    <MyButton onClick={() => openOutletModal()}>Добавить Outlet</MyButton>
                </div>

                <div className="roles-section">
                    <h3>Администраторы</h3>
                    <ul className="roles-list">
                        {roles.filter(role => role.name === 'Администратор').map((role) => (
                            <li key={role.id} className="role-item" onClick={() => showProfileModal(role.worker)}>
                                <img src={role.worker.photo} alt="profile" className="profile-photo" />
                                {role.worker.surname} {role.worker.name}
                            </li>
                        ))}
                    </ul>
                    <h3>Продавцы</h3>
                    <ul className="roles-list">
                        {roles.filter(role => role.name === 'Продавец').map((role) => (
                            <li key={role.id} className="role-item" onClick={() => showProfileModal(role.worker)}>
                                <img src={role.worker.photo} alt="profile" className="profile-photo" />
                                {role.worker.surname} {role.worker.name}
                            </li>
                        ))}
                    </ul>
                    <MyButton className="add-role-button" onClick={() => showRoleModal()}>
                        Добавить пользователя
                    </MyButton>

                    <MyButton className="add-role-button" onClick={() => openCreateProfileModal()}>
                        Добавить нового пользователя
                    </MyButton>
                </div>
            </div>
            {/* Модальное окно Outlet */}
            {outletModalVisible && (
                <MyModal visible={outletModalVisible} setVisible={setOutletModalVisible}>
                    <OutletsFormModal
                        formData={editingOutlet || { name: '', address: ''}}
                        setFormData={setEditingOutlet}
                        editingId={editingOutlet ? editingOutlet.id : null}
                        closeModal={closeOutletModal}
                        refreshProducts={() => fetchOutlets()}
                    />
                </MyModal>
            )}

            {/* Модальное окно Role */}
            {roleModalVisible && (
                <MyModal visible={roleModalVisible} setVisible={setRoleModalVisible}>
                    <ProfileRoleModal
                        outlets={outlets}
                        formData={roleFormData}
                        setFormData={setRoleFormData}
                        editingId={editingRole ? editingRole.id : null}
                        closeModal={closeRoleModal}
                        refreshRoles={() => selectedOutlet?.id && fetchRoles(selectedOutlet.id)}
                    />
                </MyModal>
            )}

            {userModalVisible && (
                <MyModal visible={userModalVisible} setVisible={setUserModalVisible}>
                    <AddProfilePage/>
                </MyModal>
            )}

            {profileModalVisible && (
                <ProfileModal visible={profileModalVisible} setVisible={setProfileModalVisible}>
                    {modalProfile && <ProfileItem profile={modalProfile} />}
                </ProfileModal>
            )}

        </div>
    );
};

export default OutletsManager;
