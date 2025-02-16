import React, { useEffect, useState } from "react";
import '../../styles/ProductModal.css';
import OutletService from "../API/OutletService";


const OutletModal = ({ formData, setFormData, editingId, closeModal, refreshProducts }) => {
    const outletService = new OutletService('http://localhost:8000');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        </div>
    );
};

export default OutletModal;
