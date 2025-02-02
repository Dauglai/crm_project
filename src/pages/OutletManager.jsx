import React, { useState, useEffect } from 'react';
import OutletService from '../components/API/OutletService';
import RoleService from '../components/API/RoleService';
import '../styles/OutletManager.css';
import MyModal from '../components/UI/MyModal/MyModal';
import OutletsFormModal from '../components/OutletsFormModal';
import MyButton from '../components/UI/button/MyButton';
import ProfileRoleModal from '../components/ProfileRoleModal';

const OutletsManager = () => {
    const outletService = new OutletService('http://localhost:8000');
    const roleService = new RoleService('http://localhost:8000');

    // Состояния для Outlet
    const [outlets, setOutlets] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingOutlet, setEditingOutlet] = useState(null);

    // Состояния для Role (назначение пользователя для Outlet)
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
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
        if (selectedOutlet) {
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
        try {
            const response = await roleService.fetchRoles(outletId);
            setRoles(response);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    // Открытие модального окна для добавления/редактирования Outlet
    const openOutletModal = (outlet = null) => {
        setEditingOutlet(outlet);
        setModalVisible(true);
    };

    const closeOutletModal = () => {
        setEditingOutlet(null);
        setModalVisible(false);
    };

    // Открытие Role-модального окна (аналог ProductPage)
    const showRoleModal = (role = null) => {
        if (role) {
            setEditingRole(role);
            setRoleFormData({
                profile: role.worker ? role.worker.id : '',
                name: role.name,
                outlet: selectedOutlet ? selectedOutlet.id : ''
            });
        } else {
            setEditingRole(null);
            setRoleFormData({
                profile: '',
                name: 'Продавец',
                outlet: selectedOutlet ? selectedOutlet.id : ''
            });
        }
        setRoleModalVisible(true);
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
                            <p>{outlet.address}</p>
                        </div>
                    ))}
                    <MyButton onClick={() => openOutletModal()}>Добавить Outlet</MyButton>
                </div>

                <div className="roles-section">
                    {selectedOutlet ? (
                        <>
                            <h3>Роли в {selectedOutlet.name}</h3>
                            <ul className="roles-list">
                                {roles.map((role) => (
                                    <li key={role.id}>
                                        {role.worker
                                            ? `${role.worker.surname} ${role.worker.name}`
                                            : 'Неизвестный сотрудник'} - {role.name}
                                    </li>
                                ))}
                            </ul>
                            <MyButton className="add-role-button" onClick={() => showRoleModal()}>
                                Добавить пользователя
                            </MyButton>
                        </>
                    ) : (
                        <p>Выберите аутлет, чтобы посмотреть роли.</p>
                    )}
                </div>
            </div>

            {/* Модальное окно Outlet */}
            {modalVisible && (
                <MyModal visible={modalVisible} setVisible={setModalVisible}>
                    <OutletsFormModal
                        formData={editingOutlet || { name: '', address: '', admin: '', sellers: [] }}
                        setFormData={setEditingOutlet}
                        editingId={editingOutlet ? editingOutlet.id : null}
                        closeModal={closeOutletModal}
                        refreshProducts={fetchOutlets}
                    />
                </MyModal>
            )}

            {/* Модальное окно Role */}
            {roleModalVisible && (
                <MyModal visible={roleModalVisible} setVisible={setRoleModalVisible}>
                    <ProfileRoleModal
                        outlet={selectedOutlet}
                        formData={roleFormData}
                        setFormData={setRoleFormData}
                        editingId={editingRole ? editingRole.id : null}
                        closeModal={closeRoleModal}
                        refreshRoles={() => fetchRoles(selectedOutlet.id)}
                    />
                </MyModal>
            )}
        </div>
    );
};

export default OutletsManager;
