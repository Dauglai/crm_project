import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/OutletManager.css'; // Стили подключите при необходимости

const OutletManager = () => {
    const [outlets, setOutlets] = useState([]);
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [editingId, setEditingId] = useState(null);

    const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken'))
        ?.split('=')[1];

    // Получение списка outlets
    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/outlet/', {
                withCredentials: true,
            });
            setOutlets(response.data.results);
        } catch (error) {
            console.error('Error fetching outlets:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Обновление Outlet
                await axios.put(`http://localhost:8000/outlet/${editingId}/`, formData, {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                alert('Outlet updated successfully');
            } else {
                // Создание Outlet
                await axios.post('http://localhost:8000/outlet/', formData, {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                alert('Outlet created successfully');
            }
            setFormData({ name: '', address: '' });
            setEditingId(null);
            fetchOutlets();
        } catch (error) {
            console.error('Error submitting outlet:', error);
            alert('Failed to submit outlet');
        }
    };

    const handleEdit = (outlet) => {
        setFormData({ name: outlet.name, address: outlet.address });
        setEditingId(outlet.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/outlet_delete/${id}/`, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,
            });
            alert('Outlet deleted successfully');
            fetchOutlets();
        } catch (error) {
            console.error('Error deleting outlet:', error);
            alert('Failed to delete outlet');
        }
    };

    return (
        <div className="outlet-manager">
            <h2>Outlet Manager</h2>
            <form className="outlet-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{editingId ? 'Update Outlet' : 'Create Outlet'}</button>
            </form>

            <div className="outlet-list">
                <h3>Outlet List</h3>
                {outlets.map((outlet) => (
                    <div key={outlet.id} className="outlet-item">
                        <p><strong>Name:</strong> {outlet.name}</p>
                        <p><strong>Address:</strong> {outlet.address}</p>
                        <button onClick={() => handleEdit(outlet)}>Edit</button>
                        <button onClick={() => handleDelete(outlet.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OutletManager;
