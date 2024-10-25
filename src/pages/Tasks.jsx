import React, {useEffect, useRef, useState} from 'react';
import PostForm from '../components/PostForm';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/MyModal/MyModal';
import Loader from '../components/UI/Loader/Loader';
import MyButton from '../components/UI/button/MyButton';
import {usePosts} from '../hooks/usePosts';
import TaskService from '../components/API/PostService';
import useFetching from '../hooks/useFetching';
import {getPageCount, getPagesArray} from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';
import {useObserver} from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";
import TaskTable from "../components/TaskTable";

function Posts() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);
    const sortedAndSearchedPosts = usePosts(tasks, filter.sort, filter.query)
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    let pagesArray = getPagesArray(totalPages);

    const [fetchPosts, isPostLoading, postError] = useFetching( async (limit, page)=> {
        const response = await TaskService.getAll(limit, page)
        setTasks([...tasks,...response.data]);
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })


    useEffect(() => {
        fetchPosts(limit, page);
    }, [page, limit])

    const createTask = (newTasks) => {
        setTasks([...tasks, newTasks])
        setModal(false)
    }

    const changePage = (page) => {
        setPage(page);
    }

    return (
        <div className="App">
            <MyButton onClick={() => setModal(true)}>Open Form</MyButton>
            <MyModal visible={modal} setVisible={setModal}><PostForm create={createTask} /></MyModal>
            {/*<PostForm create={createPost} />*/}
            <MySelect
                value={limit}
                onChange={val => setLimit(val)}
                defaultValue={"Кол-во псотов на странице"}
                options={[
                    {value: 5, name: '5'},
                    {value: 10, name: '10'},
                    {value: 25, name: '25'},
                    {value: -1, name: 'Показать все'},
                ]}
            />
            <hr style={{margin: '15px 0'}} />
            {postError && <p>Fail: {postError}</p>}
            <TaskTable tasks={sortedAndSearchedPosts} title='List'/>
            {isPostLoading
                && <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}><Loader/></div>
            }
            <Pagination
                pagesArray={pagesArray}
                page={page}
                changePage={changePage}/>
        </div>
    );
}

export default Posts;