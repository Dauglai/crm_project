import React from "react";
import MyButton from "./UI/button/MyButton";
import { useNavigate } from "react-router-dom";

const TaskItem = (props) => {
    const router = useNavigate();
    return (
        <div className='post'>
            <div className='post__content'>
                <strong>{props.post.id}. {props.post.name}</strong>
                <div>
                    {props.post.body}
                </div>
            </div>
            <div className='post__btns'>
                <MyButton onClick={() => router(`/${props.task.id}`)}>
                    Открыть
                </MyButton>
            </div>
        </div>
    )
};

export default TaskItem;