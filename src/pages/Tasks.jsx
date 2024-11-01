import React, { useEffect, useRef, useState } from 'react';
import TaskTable from "../components/TaskTable";
import Pagination from '../components/UI/pagination/Pagination';
import MySelect from "../components/UI/select/MySelect";
import axios from "axios";
import { getPageCount, getPagesArray } from '../utils/pages';
import Loader from '../components/UI/Loader/Loader';
import TaskFilter from "../components/TaskFilter";
import {useTasks} from "../hooks/useTasks";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState({sort: '', query: '', role: 'author'});
    const [modal, setModal] = useState(false);
    const sortedAndSearchedPosts = useTasks(tasks, filter.sort, filter.query)

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/task/', {
                params: {
                    page_size: limit,
                    page: page,
                    query: filter.query,
                    ordering: filter.sort,
                    role: filter.role,},
                withCredentials: true,
            });
            setTasks(response.data.results); // предполагается, что `results` содержит задачи на странице

            // Установка количества страниц на основе общего числа задач
            const totalCount = response.data.count; // `count` возвращает общее количество задач
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
        <div className="App">
            <TaskFilter filter={filter} setFilter={setFilter}/>
            <MySelect
                value={limit}
                onChange={(val) => {
                    setLimit(val);
                    setPage(1); // Переключаемся на первую страницу при изменении лимита
                }}
                defaultValue="Кол-во постов на странице"
                options={[
                    { value: 5, name: '5' },
                    { value: 10, name: '10' },
                    { value: 25, name: '25' },
                    { value: 100, name: '100' },
                ]}
            />
            <hr style={{ margin: '15px 0' }} />
            {isLoading ? (
                <Loader />
            ) : (<TaskTable tasks={sortedAndSearchedPosts} />
            )}
            <Pagination
                pagesArray={getPagesArray(totalPages)}
                page={page}
                changePage={changePage}
            />
        </div>
    );
}

export default Tasks;
