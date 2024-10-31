// TaskTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/tableStyles.css';
import TaskItem from "./TaskItem";

const TaskTable = ({tasks, error}) => {
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Список задач</h1>
            <table className="table" border="1" cellPadding="5" cellSpacing="0">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Тема</th>
                    <th>Автор</th>
                    <th>Исполнитель</th>
                    <th>Статус</th>
                    <th>Срок выполнения</th>
                    <th>Время создания</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
