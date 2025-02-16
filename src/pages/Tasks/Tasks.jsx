// Tasks.js
import React, { useEffect, useState } from 'react';
import TaskTable from "../../components/Tasks/TaskTable";
import Pagination from '../../components/UI/pagination/Pagination';
import MySelect from "../../components/UI/select/MySelect";
import axios from "axios";
import { getPageCount, getPagesArray } from '../../utils/pages';
import Loader from '../../components/UI/Loader/Loader';
import TaskFilter from "../../components/TaskCRUD/TaskFilter";
import { useTasks } from "../../hooks/useTasks";
import './Tasks.css';
import RoleList from "../../components/UI/RoleList/RoleList";


function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState({ sort: '', query: '', role: 'all' });
    const sortedAndSearchedPosts = useTasks(tasks, filter.sort, filter.query);

    const handleAccept = async (notifId) => {
        await axios.post(`/notifications/${notifId}/`, { action: 'accept' });
    };

    const handleDismiss = async (notifId) => {
        await axios.post(`/notifications/${notifId}/`, { action: 'dismiss' });
    };

    const handleTaskCreated = (newTask) => {
        setTasks([...tasks, newTask]);
    };

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
            const totalCount = response.data.count;
            setTotalPages(getPageCount(totalCount, limit));
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, limit, filter]);

    const changePage = (page) => {
        setPage(page);
    };



    return (
        <div className="tasks-container">
            <div className="content-container">
                <RoleList
                    selectedRole={filter.role}
                    onRoleChange={(selectedRole) => setFilter({ ...filter, role: selectedRole })}
                />
                <div className="table-wrapper">
                    <TaskFilter filter={filter} setFilter={setFilter} setPage={setPage} setLimit={setLimit} limit={limit} page={page} />
                    <hr style={{ margin: '15px 0' }} />
                    <TaskTable tasks={sortedAndSearchedPosts} />

                    <Pagination
                        pagesArray={getPagesArray(totalPages)}
                        page={page}
                        changePage={changePage}
                    />
                </div>
            </div>
        </div>
    );
}

export default Tasks;
