import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetching from "../../hooks/useFetching";
import axios from "axios";
import TaskIdComment from "../../components/TaskId/TaskIdComment";
import { MentionsInput, Mention } from 'react-mentions';
import './TaskIdPage.css';
import { format } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import ReactQuill from "react-quill";


function TaskIdPage() {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("comments");
    const [userProfile, setUserProfile] = useState(null);
    const [userApproval, setUserApproval] = useState(null);
    const [recipient, setRecipient] = useState(null);
    const [coordinations, setCoordinations] = useState([]);
    const [isAgreed, setIsAgreed] = useState(task?.is_agreed || false);
    const isRecipient = task?.adresse?.id === userProfile?.id;
    const isAuthor = task?.author?.id === userProfile?.id;
    const [result, setResult] = useState(null);

    const [fetchTask, isLoading, error] = useFetching(async (taskId) => {
        try {
            const response = await axios.get(`http://localhost:8000/task/${taskId}/`, {
                withCredentials: true,
            });
            setTask(response.data);
            setComments(response.data.comment_set);

            const approval = response.data.coordination_set.find(c => c.coordinator.id === response.data.current_user.id);
            setUserApproval(approval ? approval.is_agreed : null);
        } catch (err) {
            console.error('Failed to load task:', err);
        }
    });

    const [progress, setProgress] = useState([]);

    useEffect(() => {
        fetchTask(id);
        axios.get(`http://localhost:8000/task/${id}/progress/`, { withCredentials: true })
            .then((response) => setProgress(response.data))
            .catch((err) => console.error("Ошибка загрузки хода задачи:", err));

        axios.get(`http://localhost:8000/task/${id}/coordination/`, { withCredentials: true })
            .then(response => {
                setCoordinations(response.data);
                // Находим статус согласования текущего пользователя
                const currentApproval = response.data.find(c => c.coordinator.id === userProfile?.id);
                setUserApproval(currentApproval ? currentApproval.is_agreed : null);
            })
            .catch((err) => console.error("Ошибка загрузки хода задачи:", err));

        axios.get('http://localhost:8000/accounts/profile/', { withCredentials: true })
            .then((response) => {
                setUsers(response.data.results);
                setUserProfile(response.data.current_user);
            });

    }, [id]);

    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];

    useEffect(() => {
        fetchTask(id);
    }, [id]); // Теперь состояние userApproval корректно обновляется

    const handleApproval = async (isApproved) => {
        try {
            await axios.post(
                `http://localhost:8000/task/${id}/coordination/`,
                { is_agreed: isApproved },
                {
                    headers: { "X-CSRFToken": csrfToken },
                    withCredentials: true,
                }
            );
            setUserApproval(isApproved);
            fetchTask(id);  // Обновляем данные задачи
        } catch (err) {
            console.error("Ошибка при согласовании:", err);
        }
    };
    const handleAddComment = async () => {
        try {
            await axios.post(`http://localhost:8000/task/${id}/comments/`,
                {
                    text: newComment,
                    recipient_id: recipient || null, // Если не выбран — оставляем null
                }, {
                    headers: { "X-CSRFToken": csrfToken },
                    withCredentials: true,
                });
            setNewComment("");
            setRecipient(null); // Сбрасываем получателя
            fetchTask(id);
        } catch (err) {
            console.error("Ошибка при добавлении комментария:", err);
        }
    };

    const handleSubmitResult = async () => {
        try {
            await axios.post(
                `http://localhost:8000/task/${id}/result/`,
                {
                    description: result.description,
                    file: result.file || null,
                    task: task.id,
                    author: userProfile.user.id,

                },
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                }
            );
            alert("Результат отправлен!");
            fetchTask(id);
        } catch (err) {
            console.error("Ошибка отправки результата:", err);
        }
    };

    const handleApproveResult = async (isApproved) => {
        try {
            await axios.patch(
                `http://localhost:8000/task/${id}/`,
                { is_agreed: isApproved },
                { headers: { "X-CSRFToken": csrfToken }, withCredentials: true }
            );
            fetchTask(id);
        } catch (err) {
            console.error("Ошибка согласования результата:", err);
        }
    };


    return (
        <div className="task-page">
            <h1 className="task-title">Задача: {task?.name}</h1>

            {/* Блоки "Автор" и "Адресат" в строку */}
            <div className="form-block full-width">
                <div className="row">
                        <p><strong>Автор:</strong> {task?.author?.surname} {task?.author?.name}</p>
                        <p><strong>Адресат:</strong> {task?.addressee?.surname} {task?.addressee?.name}</p>
                        <p><strong>Срок:</strong> {task?.deadline}</p>
                        <p><strong>Статус:</strong> {task?.status}</p>
                </div>

                <p><strong>Описание:</strong></p>
                <div className="description-content" dangerouslySetInnerHTML={{ __html: task?.description }} />
            </div>


            {/* Кнопки согласования */}
            {task?.coordinators?.some(coord => coord.id === userProfile?.id) && (
                <div className="approval-buttons">
                    {userApproval === true ? (
                        <button className="approved" disabled>Вами согласовано</button>
                    ) : userApproval === false ? (
                        <button className="not-approved" disabled>Вами не согласовано</button>
                    ) : (
                        <>
                            <button className="approve-button" onClick={() => handleApproval(true)}>Согласовать</button>
                            <button className="reject-button" onClick={() => handleApproval(false)}>Не согласовать
                            </button>
                        </>
                    )}
                </div>
            )}


            {/* Мини-навигация */}
            <div className="mini-navigation">
                <button onClick={() => setActiveTab("comments")}
                        className={activeTab === "comments" ? "active" : ""}>Комментарии
                </button>
                <button onClick={() => setActiveTab("result")}
                        className={activeTab === "result" ? "active" : ""}>Результат
                </button>
                <button onClick={() => setActiveTab("approvers")}
                        className={activeTab === "approvers" ? "active" : ""}>Список согласователей
                </button>
                <button onClick={() => setActiveTab("progress")}
                        className={activeTab === "progress" ? "active" : ""}>Ход задачи
                </button>
            </div>

            {/* Контент вкладок */}
            <div className="tab-content">
                {activeTab === "comments" && (
                    <>
                        <h2>Комментарии</h2>
                        <div className="comments-section">
                            {comments.map(comment => (
                                <TaskIdComment key={comment.id} comment={comment}/>
                            ))}
                        </div>
                        <div className="add-comment">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Введите комментарий"
                            />
                            <select onChange={(e) => setRecipient(Number(e.target.value) || null)}>
                                <option value="">Выберите получателя (необязательно)</option>
                                {users.map(profile => (
                                    <option key={profile.author.id} value={profile.author.id}>{profile.name}</option>
                                ))}
                            </select>
                            <button onClick={handleAddComment}>Добавить</button>
                        </div>
                    </>
                )}

                {activeTab === "result" && (
                    <div className="result-section">
                        <h2>Результат</h2>
                        {task.result ? (
                            <>
                                <p><strong>Описание:</strong> {task.result.description}</p>
                                {task.result.file &&
                                    <a href={task.result.file} target="_blank" rel="noopener noreferrer">Скачать
                                        файл</a>}
                                <p><strong>Автор:</strong> {task.result.author.surname} {task.result.author.name}</p>
                            </>
                        ) : (
                            <p>Результат пока не добавлен</p>
                        )}
                        {userProfile?.id === task?.adresse?.id && (
                            <div>
                                <ReactQuill value={result?.description || ""}
                                            onChange={(value) => setResult({...result, description: value})}/>
                                <input type="file" onChange={(e) => setResult({...result, file: e.target.files[0]})}/>
                                <button onClick={handleSubmitResult}>
                                    {task?.result ? "Обновить результат" : "Отправить результат"}
                                </button>
                            </div>
                        )}

                        {userProfile?.id === task?.author?.id && task?.result && task?.status !== "Завершена" && (
                            <div>
                                <p>{task.result.description}</p>
                                {task.result.file && <a href={task.result.file} download>Скачать файл</a>}
                                <button onClick={() => handleApproveResult(true)}>Принять</button>
                                <button onClick={() => handleApproveResult(false)}>Отклонить</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "approvers" && (
                    <div className="approvers-section">
                        <h2>Список согласователей</h2>
                        <ul>
                            {task.coordination_set.length > 0 ? (
                                task.coordination_set.map(coord => (
                                    <li key={coord.coordinator?.id || Math.random()}
                                        style={{color: coord.is_agreed ? "green" : "red"}}>
                                        {coord.coordinator
                                            ? `${coord.coordinator.surname} ${coord.coordinator.name}`
                                            : "Неизвестный пользователь"}
                                        {coord.is_agreed ? " ✅" : " ❌"}
                                    </li>
                                ))
                            ) : (
                                <p>Нет согласователей</p>
                            )}
                        </ul>
                    </div>
                )}

                {activeTab === "progress" && (
                    <div className="progress-section">
                        <h2>Ход задачи</h2>
                        {progress.length > 0 ? (
                            progress.map((record, index) => (
                                <p key={index}>
                                    <strong>{record.author.surname} {record.author.name[0]}.</strong> —
                                    {format(new Date(record.datetime), "dd.MM.yyyy HH:mm", {locale: ruLocale})}
                                    <br/>
                                    {record.record}
                                </p>
                            ))
                        ) : (
                            <p>Нет записей о ходе задачи</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default TaskIdPage;
