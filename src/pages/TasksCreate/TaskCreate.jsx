import React, { useState } from 'react';
import TaskCreateForm from '../../components/TaskCRUD/TaskCreateForm';

function TaskPage() {
    const [tasks, setTasks] = useState([]);

    const handleTaskCreated = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    return (
        <div>
            <h1>Создать новую задачу</h1>
            <TaskCreateForm onTaskCreated={handleTaskCreated} />
            {/* Дополнительно: можно отобразить список задач */}
        </div>
    );
}

export default TaskPage;
