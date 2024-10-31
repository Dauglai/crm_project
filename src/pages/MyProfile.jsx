import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import PostService from "../components/API/PostService";
import useFetching from "../hooks/useFetching";
import Loader from '../components/UI/Loader/Loader'
import PostIdPagesComment from "./PostidPagesComment";

const MyProfile= (props) => {
    const params = useParams();
    const [post, setPost] = useState({});
    const [fetchPostById, isLoading, error] = useFetching(async (id)=>{
        const response = await PostService.getbyId(id)
        setPost(response.data)
    })
    useEffect(() =>{
        fetchPostById(params.id);
    })
    return (
        <div>
            <h1>Пост с id={params.id}</h1>
            <p>{post.title} {post.body}</p>
            <h1>Комментарии</h1>
            <PostIdPagesComment />
            {/* {isLoading
                ? <Loader />
                : <p>{post.title} {post.body}</p>
            } */}
        </div>
    );
}

export default MyProfile;