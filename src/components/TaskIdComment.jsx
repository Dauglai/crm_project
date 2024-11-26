import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskIdComment = ({ comment }) => {

    return (
        <div className="comment">
            <p>
                <strong>
                    {comment.owner ? `${comment.owner.surname} ${comment.owner.name}` : 'Загрузка...'}:
                </strong>
            </p>
            <p>{comment.text}</p>
            <span>{new Date(comment.datetime).toLocaleString()}</span>
        </div>
    );
};

export default TaskIdComment;
