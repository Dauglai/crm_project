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
import {useAuth} from "../../context";


function TaskIdPage({ id: propId }) {
    const { id: paramId } = useParams(); // Извлекаем id из URL
    const id = propId || paramId; // Используем propId, если он передан, иначе берем из useParams()
    //const { id } = useParams();
    console.log("Task ID from URL:", id);
    const [task, setTask] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("comments");
    const [userApproval, setUserApproval] = useState(null);
    const [recipient, setRecipient] = useState(null);
    const [isAgreed, setIsAgreed] = useState(task?.is_agreed || false);
    const isRecipient = false;
    const isAuthor = false;
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

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8000/accounts/profile/', { withCredentials: true });
                console.log("🔹 Профиль загружен:", response.data);
                setUserProfile(response.data.results[0]);
            } catch (error) {
                console.error("❌ Ошибка загрузки профиля:", error);
            }
        };
        fetchUserProfile();
    }, []);

    const [progress, setProgress] = useState([]);

    const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];

    // 🔹 Загружаем данные пользователя

    // 🔹 Загружаем данные задачи и согласования
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загружаем задачу
                const taskRes = await axios.get(`http://localhost:8000/task/${id}/`, { withCredentials: true });
                setTask(taskRes.data);

                // Загружаем ход задачи
                const progressRes = await axios.get(`http://localhost:8000/task/${id}/progress/`, { withCredentials: true });
                setProgress(progressRes.data);

                // Определяем, согласовал ли текущий пользователь
                const currentApproval = taskRes.data.coordination_set.find(c => c.coordinator.id === userProfile.author.id);
                setUserApproval(currentApproval ? currentApproval.is_agreed : null);

                // Загружаем пользователей
                const usersRes = await axios.get('http://localhost:8000/accounts/search_profiles/', { withCredentials: true });
                setUsers(usersRes.data.results);

            } catch (error) {
                console.error("❌ Ошибка загрузки данных:", error);
            }
        };

        fetchData();
    }, [id, userProfile]); // ✅ Теперь ждем userProfile перед загрузкой данных

    // 🔹 Логируем обновленный профиль пользователя
    useEffect(() => {
        if (userProfile) {
            console.log("✅ Обновленный userProfile:", userProfile.author.id);
        }
    }, [userProfile]);

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
                    author: userProfile?.id, // передаем ID текущего пользователя
                },
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            alert("Результат отправлен!");
            fetchTask(id); // Обновляем данные задачи
        } catch (err) {
            console.error("Ошибка отправки результата:", err);
        }
    };

    const handleUpdateResult = async () => {
        try {
            await axios.put(
                `http://localhost:8000/task/${id}/result/`,
                {
                    description: result.description,
                    file: result.file || null,
                },
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
            alert("Результат обновлен!");
            fetchTask(id); // Обновляем данные задачи
        } catch (err) {
            console.error("Ошибка обновления результата:", err);
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

            <div className="task-container">
                {/* Заголовок и статус в одной строке */}
                <div className="task-header">
                    <h1 className="task-title">Задача: {task?.name}</h1>
                    <span className={`task-status ${task?.status?.toLowerCase()}`}>{task?.status}</span>
                </div>

                {/* Автор, адресат и срок в одной строке */}
                <div className="task-infos">
                    <div className="task-item">
                        <strong>Автор:  </strong> {task?.author?.surname} {task?.author?.name}
                    </div>
                    <div className="task-item">
                        <strong>Адресат:  </strong>{task?.addressee?.surname} {task?.addressee?.name}
                    </div>
                    <div className="task-item">
                        <strong>Срок:  </strong> {task?.deadline}
                    </div>
                </div>

                <p><strong>Описание:</strong></p>
                <div className="description-content" dangerouslySetInnerHTML={{__html: task?.description}}/>
            </div>


            {/* Кнопки согласования */}
            {Array.isArray(task?.coordinators) &&
                task.coordinators.some(coord => coord.id === userProfile?.author.id) && (
                    <div className="approval-buttons">
                        {userApproval === true ? (
                            <button className="approved" disabled>✅ Вами согласовано</button>
                        ) : userApproval === false ? (
                            <button className="not-approved" disabled>❌ Вами не согласовано</button>
                        ) : (
                            <>
                                <button className="approve-button" onClick={() => handleApproval(true)}>✅ Согласовать
                                </button>
                                <button className="reject-button" onClick={() => handleApproval(false)}>❌ Не
                                    согласовать
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
                                <div className="description-content"
                                     dangerouslySetInnerHTML={{__html: task.result?.description}}/>
                                {task?.result?.file && (
                                    <a href={task.result.file} download target="_blank" rel="noopener noreferrer">
                                        Скачать файл
                                    </a>
                                )}
                                <p><strong>Автор:</strong> {task.addressee.surname} {task.addressee.name}</p>
                            </>
                        ) : (
                            <p>Результат пока не добавлен</p>
                        )}

                        {userProfile?.author.id === task?.author.id && task?.result && task?.status !== "Завершена" && (
                            <div className="result-buttons">
                                <button className="accept-button" onClick={() => handleApproveResult(true)}>✔️ Принять
                                </button>
                                <button className="decline-button" onClick={() => handleApproveResult(false)}>❌
                                    Отклонить
                                </button>
                            </div>
                        )}

                        {userProfile?.author.id === task?.addressee?.author.id && (
                            <div>
                                <ReactQuill value={result?.description || ""}
                                            onChange={(value) => setResult({...result, description: value})}/>
                                <input type="file" onChange={(e) => setResult({...result, file: e.target.files[0]})}/>
                                {task?.result ? (
                                    <button onClick={handleUpdateResult}>Обновить результат</button>
                                ) : (
                                    <button onClick={handleSubmitResult}>Добавить результат</button>
                                )}
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
