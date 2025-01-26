import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClientManager.css'; // Стили подключите при необходимости

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        patronymic: '',
        address: '',
    });
    const [editingId, setEditingId] = useState(null);

    const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken'))
        ?.split('=')[1];

    // Получение списка клиентов
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/clients/', {
                withCredentials: true,
            });
            setClients(response.data.results);
        } catch (error) {
            console.error('Error fetching clients:', error);
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
                // Обновление клиента
                await axios.put(`http://localhost:8000/clients/${editingId}/`, formData, {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                alert('Client updated successfully');
            } else {
                // Создание клиента
                await axios.post('http://localhost:8000/clients/', formData, {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                alert('Client created successfully');
            }
            setFormData({ surname: '', name: '', patronymic: '', address: '' });
            setEditingId(null);
            fetchClients();
        } catch (error) {
            console.error('Error submitting client:', error);
            alert('Failed to submit client');
        }
    };

    const handleEdit = (client) => {
        setFormData({
            surname: client.surname,
            name: client.name,
            patronymic: client.patronymic || '',
            address: client.address,
        });
        setEditingId(client.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/clients/${id}/`, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,
            });
            alert('Client deleted successfully');
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Failed to delete client');
        }
    };

    return (
        <div className="client-manager">
            <h2>Client Manager</h2>
            <form className="client-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="surname">Surname:</label>
                    <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                    <label htmlFor="patronymic">Patronymic:</label>
                    <input
                        type="text"
                        id="patronymic"
                        name="patronymic"
                        value={formData.patronymic}
                        onChange={handleChange}
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
                <button type="submit">{editingId ? 'Update Client' : 'Create Client'}</button>
            </form>

            <div className="client-list">
                <h3>Client List</h3>
                {clients.map((client) => (
                    <div key={client.id} className="client-item">
                        <p><strong>Surname:</strong> {client.surname}</p>
                        <p><strong>Name:</strong> {client.name}</p>
                        <p><strong>Patronymic:</strong> {client.patronymic || 'N/A'}</p>
                        <p><strong>Address:</strong> {client.address}</p>
                        <button onClick={() => handleEdit(client)}>Edit</button>
                        <button onClick={() => handleDelete(client.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientManager;
