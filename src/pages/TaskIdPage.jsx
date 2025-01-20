import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetching from "../hooks/useFetching";
import axios from "axios";
import TaskIdComment from "../components/TaskIdComment";
import { MentionsInput, Mention } from 'react-mentions';
import '../styles/TaskIdPage.css';

function TaskIdPage() {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [users, setUsers] = useState([]);

    const [fetchTask, isLoading, error] = useFetching(async (taskId) => {
        try {
            const response = await axios.get(`http://localhost:8000/task/${taskId}/`, {
                withCredentials: true,
            });
            setTask(response.data);
            setComments(response.data.comment_set);
        } catch (err) {
            console.error('Failed to load task:', err);
        }
    });

    useEffect(() => {
        fetchTask(id);
    }, [id]);

    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];

    useEffect(() => {
        axios.get('http://localhost:8000/accounts/profile/', { withCredentials: true })
            .then((response) => setUsers(response.data.results));
    }, []);

    const handleAddComment = async () => {

        try {
            await axios.post(
                `http://localhost:8000/task/${id}/comments/`,
                {
                    text: newComment,
                }, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                    withCredentials: true,
                }
            );
            setNewComment("");
            fetchTask(id);
        } catch (err) {
            console.error("Ошибка при добавлении комментария:", err);
        }
    };

    return (
        <div className="task-page">
            <h1>Задача: {task?.name}</h1>
            <div className="task-details">
                <p><strong>Описание:</strong> {task?.description}</p>
                <p><strong>Автор:</strong> {task?.author?.surname} {task?.author?.name}</p>
                <p><strong>Срок:</strong> {task?.deadline}</p>
                <p><strong>Статус:</strong> {task?.status}</p>
            </div>

            <div className="details-section">
                <h3>Координаторы</h3>
                <ul>
                    {task?.coordinators?.length > 0 ? (
                        task.coordinators.map(coordinator => (
                            <li key={coordinator.id}>
                                {coordinator.surname} {coordinator.name}
                            </li>
                        ))
                    ) : (
                        <p>Нет координаторов</p>
                    )}
                </ul>

                <h3>Согласователи</h3>
                <ul>
                    {task?.observers?.length > 0 ? (
                        task.observers.map(observer => (
                            <li key={observer.id}>
                                {observer.surname} {observer.name}
                            </li>
                        ))
                    ) : (
                        <p>Нет согласователей</p>
                    )}
                </ul>
            </div>

            <h2>Комментарии</h2>
            <div className="comments-section">
                {comments.map(comment => (
                    <TaskIdComment key={comment.id} comment={comment} />
                ))}
            </div>

            <div className="add-comment">
                <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Добавьте комментарий"
                >
                    <Mention
                        trigger="@"
                        data={users.map(user => ({ id: user.author.id, display: `${user.name} ${user.surname}` }))}
                    />
                </MentionsInput>
                <button onClick={handleAddComment}>Добавить</button>
            </div>
        </div>
    );
}

export default TaskIdPage;
