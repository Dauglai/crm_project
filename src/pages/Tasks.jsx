import React, {useEffect, useRef, useState} from 'react';
import PostForm from '../components/PostForm';
import MyModal from '../components/UI/MyModal/MyModal';
import Loader from '../components/UI/Loader/Loader';
import MyButton from '../components/UI/button/MyButton';
import { useTasks } from '../hooks/useTasks';
import TaskService from '../components/API/PostService';
import useFetching from '../hooks/useFetching';
import { getPageCount, getPagesArray } from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';
import TaskTable from "../components/TaskTable";
import TaskFilter from "../components/TaskFilter";
import axios from "axios";
import MySelect from "../components/UI/select/MySelect";
import {useObserver} from "../hooks/useObserver";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ sort: '', query: '' });
    const [modal, setModal] = useState(false);
    const sortedAndSearchedTasks = useTasks(tasks, filter.sort, filter.query);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const lastElement = useRef();
    const observer = useRef();
    let pagesArray = getPagesArray(totalPages);

    const [fetchTasks, isTaskLoading, taskError] = useFetching(async (limit, page) => {
        try {
            const response = await axios.get('http://localhost:8000/task/', {
                params: { _limit: limit, _page: page },
                withCredentials: true,
            });
            setTasks(response.data);
            const totalCount = 100
            console.log('totalCount', totalCount);
            setTotalPages(getPageCount(totalCount, limit)); // Если -1, показываем все
        } catch (err) {
            setError('Failed to load tasks');
        }
    });


    useEffect(() => {
        fetchTasks(limit, page);
    }, [page, limit]);

    const createTask = (newTask) => {
        setTasks([...tasks, newTask]);
        setModal(false);
    };

    const changePage = (page) => {
        setPage(page);
    };

    const removeTask = (task) => {
        setTasks(tasks.filter(p => p.id !== task.id));
    };

    return (
        <div className="App">
            <MyButton onClick={() => setModal(true)}>Open Form</MyButton>
            <MyModal visible={modal} setVisible={setModal}><PostForm create={createTask}/></MyModal>
            <TaskFilter filter={filter} setFilter={setFilter}/>
            <MySelect
                value={limit}
                onChange={(val) => {
                    setLimit(val);
                    setPage(1); // сбрасываем на первую страницу при изменении лимита
                }}
                defaultValue={"Кол-во постов на странице"}
                options={[
                    {value: 5, name: '5'},
                    {value: 10, name: '10'},
                    {value: 25, name: '25'},
                    {value: -1, name: 'Показать все'},
                ]}
            />
            <hr style={{margin: '15px 0'}}/>
            {taskError && <p>Fail: {taskError}</p>}
            <TaskTable tasks={sortedAndSearchedTasks} error={error}/>
            {isTaskLoading &&
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}><Loader/></div>}
            <Pagination
                pagesArray={pagesArray}
                page={page}
                changePage={changePage}/>

        </div>
    );
}

export default Tasks;
