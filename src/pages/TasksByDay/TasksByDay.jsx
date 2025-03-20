import React, { useEffect, useState } from 'react';
import TaskFilter from "../../components/TaskCRUD/TaskFilter";
import axios from "axios";
import { getPageCount } from '../../utils/pages';
import { useTasks } from "../../hooks/useTasks";
import '../Tasks/Tasks.css';
import TaskListByDay from "../../components/TaskId/TaskListByDay";
import TaskListColumn from "../../components/TaskId/TaskListColumn";

function TasksByDay() {
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState({ sort: 'status', query: '', role: 'addressee' });
    const [viewMode, setViewMode] = useState('column'); // "column" | "list"

    const sortedAndSearchedTasks = useTasks(tasks, filter.sort, filter.query);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/task/', {
                params: {
                    page_size: limit,
                    page: page,
                    query: filter.query,
                    ordering: filter.sort,
                    role: filter.role,
                },
                withCredentials: true,
            });
            setTasks(response.data.results);
            setTotalPages(getPageCount(response.data.count, limit));
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, limit, filter]);

    return (
        <div className="tasks-container">
            <div className="content-container">
                <div className="table-wrapper">
                    <TaskFilter filter={filter} setFilter={setFilter} setPage={setPage} setLimit={setLimit} limit={limit} page={page} />
                    <hr style={{ margin: '15px 0' }} />

                    {/* Кнопка переключения вида */}
                    <button
                        className="view-toggle-btn"
                        onClick={() => setViewMode(viewMode === "column" ? "list" : "column")}
                    >
                        {viewMode === "column" ? "Переключить на список" : "Переключить на колонки"}
                    </button>

                    {/* Отображение задач в зависимости от режима */}
                    {viewMode === "column" ? (
                        <TaskListColumn tasks={sortedAndSearchedTasks} />
                    ) : (
                        <TaskListByDay tasks={sortedAndSearchedTasks} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default TasksByDay;
