import React, { useEffect, useState } from "react";
import ProductService from "./API/ProductService";
import GroupService from "./API/GroupService";
import '../styles/ProductModal.css';
import OutletService from "./API/OutletService";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ProfileModal from "./UI/ProfileModal/ProfileModal";
import EmployeeList from "./EmployeeList";


const OutletModal = ({ formData, setFormData, editingId, closeModal, refreshProducts }) => {
    const [profiles, setProfiles] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalField, setModalField] = useState("");
    const outletService = new OutletService('http://localhost:8000');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('http://localhost:8000/accounts/profile/', {
                withCredentials: true,
            });
            setProfiles(response.data.results);
        };
        fetchTasks();
    }, []);

    const openModal = (field) => {
        setModalField(field);
        setModalVisible(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await outletService.updateOutlet(editingId, formData);
            } else {
                await outletService.createOutlet(formData);
            }
            setFormData({ name: '', address: '' });
            refreshProducts();
            closeModal();
        } catch (error) {
            console.error('Error submitting outlet:', error);
        }
    };


    return (
        <div className="modal-overlay">
            <h2>Outlet Manager</h2>
            <form className="outlet-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required/>
                    </div>
                </div>
                <div className="form-buttons">
                    <button type="submit">{editingId ? 'Update Outlet' : 'Create Outlet'}</button>
                    <button type="button" className="cancel-button" onClick={closeModal}>Отмена</button>
                </div>
            </form>

            <ProfileModal visible={modalVisible} setVisible={setModalVisible}>
            <EmployeeList
                    profiles={profiles}
                    taskData={formData}
                    setTaskData={setFormData}
                    field={modalField}
                />
            </ProfileModal>
        </div>
    );
};

export default OutletModal;
