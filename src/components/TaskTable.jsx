// TaskTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './tableStyles.css';

const TaskTable = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/task/', {
                    withCredentials: true,
                });
                setTasks(response.data);
            } catch (err) {
                setError('Failed to load tasks');
            }
        };

        fetchTasks();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Список задач</h1>
            <table className="table" border="1" cellPadding="5" cellSpacing="0">
                <thead>
                <tr>
                    <th>Название задачи</th>
                    <th>Автор</th>
                    <th>Исполнитель</th>
                    <th>Срок выполнения</th>
                    <th>Статус</th>
                    <th>Описание</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map(task => (
                    <tr key={task.id}>
                        <td>{task.name}</td>
                        <td>{task.author}</td>
                        <td>{task.addressee}</td>
                        <td>{task.deadline}</td>
                        <td>{task.status}</td>
                        <td>{task.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
