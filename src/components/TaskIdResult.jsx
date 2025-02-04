import React from "react";
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import "../styles/TaskIdComment.css";

const TaskIdResult = ({ comment }) => {
    return (
        <div className="comment">
            <div className="comment-header">
                {comment.owner?.photo ? (
                    <img src={comment.owner.photo} alt="Аватар" className="comment-avatar" />
                ) : (
                    <div className="comment-avatar-placeholder">👤</div>
                )}

                <div>
                    <p className="comment-author">
                        <strong>{comment.owner.surname} {comment.owner.name[0]}.</strong>
                    </p>
                    <span className="comment-time">
                        {format(new Date(comment.datetime), "dd.MM.yyyy HH:mm", { locale: ruLocale })}
                    </span>
                </div>
            </div>

            <p className="comment-text">{comment.text}</p>

            {comment.recipient && (
                <p className="comment-recipient">
                    <strong>Кому:</strong> {comment.recipient.surname} {comment.recipient.name[0]}.
                </p>
            )}
        </div>
    );
};

export default TaskIdResult;
