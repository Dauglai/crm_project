import React, {useEffect, useRef, useState} from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/MyModal/MyModal';
import Loader from '../components/UI/Loader/Loader';
import MyButton from '../components/UI/button/MyButton';
import {usePosts} from '../hooks/usePosts';
import PostService from '../components/API/PostService';
import useFetching from '../hooks/useFetching';
import {getPageCount, getPagesArray} from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';
import {useObserver} from "../hooks/useObserver";
import MySelect from "../components/UI/select/MySelect";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({sort: '', query: ''});
    const [modal, setModal] = useState(false);
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
    const lastElement = useRef();
    const observer = useRef();
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    let pagesArray = getPagesArray(totalPages);

    const [fetchPosts, isPostLoading, postError] = useFetching( async (limit, page)=> {
        const response = await PostService.getAll(limit, page)
        setPosts([...posts,...response.data]);
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    useObserver(lastElement, page < totalPages, isPostLoading, () => {
        setPage(page + 1);
    })

    useEffect(() => {
        fetchPosts(limit, page);
    }, [page, limit])

    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const changePage = (page) => {
        setPage(page);
    }

    // Получаем post из дочернего компонента
    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    return (
        <div className="App">
            <MyButton onClick={() => setModal(true)}>Open Form</MyButton>
            <MyModal visible={modal} setVisible={setModal}><PostForm create={createPost} /></MyModal>
            {/*<PostForm create={createPost} />*/}
            <PostFilter filter={filter} setFilter={setFilter}/>
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
            <PostList remove={removePost} posts={sortedAndSearchedPosts} title='List'/>
            <div ref={lastElement} style={{height:20, background:'white'}}/>
            {isPostLoading
                && <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}><Loader /></div>
            }
            <Pagination
                pagesArray={pagesArray}
                page={page}
                changePage={changePage}/>
        </div>
    );
}

export default Posts;