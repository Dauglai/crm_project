import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import PostService from "../components/API/PostService";
import useFetching from "../hooks/useFetching";

const PostIdPagesComment = (props) => {
    const params = useParams();
    const [postComments, setPostComment] = useState([]);
    const [fetchPostByIdComment, isLoading, error] = useFetching(async(id)=>{
        const response = await PostService.getbyIdComment(id)
        setPostComment(response.data)
    })
    useEffect(() =>{
        fetchPostByIdComment(params.id);
    })
    return (
        <div>
            {postComments.map( (comment) =>
                <div>
                    <h1>Author: {comment.name} - {comment.email}</h1>
                    <p>Text comment: {comment.body}</p>
                </div>
            )}
        </div>
    );
}

export default PostIdPagesComment;