import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetailPage.css";
import MyModal from "../../components/UI/MyModal/MyModal";
import MyButton from "../../components/UI/button/MyButton";
import MyInput from "../../components/UI/input/MyInput";
import TaskIdPage from "../TaskId/TaskIdPage";

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [task, setTask] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [splitScreen, setSplitScreen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/orders/${orderId}/`, {
                    withCredentials: true,
                });
                console.log("Загруженный заказ:", response.data); // Лог заказа
                setOrder(response.data);

                if (response.data.task) {
                    console.log("Найденная задача в заказе:", response.data.task); // Лог задачи
                    setTaskId(response.data.task.id);
                    setTask(response.data.task);
                    setSplitScreen(true);
                }
            } catch (error) {
                console.error("Ошибка загрузки заказа:", error);
            }
        };

        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:8000/task/?page_size=100&page=1&query=&ordering=&role=all", {
                    withCredentials: true,
                });
                setTasks(response.data.results);
            } catch (error) {
                console.error("Ошибка загрузки задач:", error);
            }
        };

        fetchTasks();
    }, []);

    const getCsrfToken = () => {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="))
            ?.split("=")[1] || "";
    };

    const handleTaskSelect = async (selectedTask) => {
        if (!order) return;

        try {
            await axios.patch(
                `http://localhost:8000/task/${selectedTask.id}/`,
                { order: order.id },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCsrfToken(),
                    },
                }
            );

            setTask(selectedTask);
            setSplitScreen(true);
            setShowTaskModal(false);
        } catch (error) {
            console.error("Ошибка привязки задачи:", error);
        }
    };

    return (
        <div className="order-detail-page">
            <h1>Детали заказа</h1>
            {order ? (
                <div className={`order-task-container ${splitScreen ? "split" : ""}`}>
                    <div className="order-section">
                        <h2>Заказ #{order.id}</h2>
                        <p><strong>Точка продажи:</strong> {order.outlet || "Не указана"}</p>
                        <p><strong>Клиент:</strong> {order.client?.name || "Не указан"}</p>
                        <p><strong>Описание:</strong> {order.description || "Без описания"}</p>

                        <h3>Выбранные продукты:</h3>
                        <ul>
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <li key={index}>{item.name} - {item.quantity} шт.</li>
                                ))
                            ) : (
                                <p>Нет добавленных продуктов</p>
                            )}
                        </ul>



                        <MyButton onClick={() => setShowTaskModal(true)}>Привязать задачу</MyButton>

                        <button onClick={() => setSplitScreen(!splitScreen)}>
                            {splitScreen ? "Скрыть задачу" : "Показать задачу"}
                        </button>
                    </div>


                    {splitScreen && taskId && (

                        <div className="task-section">
                            <TaskIdPage id={taskId} />
                        </div>
                    )}
                </div>
            ) : (
                <p>Загрузка данных заказа...</p>
            )}

            <MyModal visible={showTaskModal} setVisible={setShowTaskModal}>
                <div className="task-modal">
                    <h2>Выберите задачу</h2>
                    <MyInput
                        type="text"
                        placeholder="Поиск задачи..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <ul className="task-list">
                        {tasks
                            .filter(task => task.name.toLowerCase().includes(search.toLowerCase()))
                            .map(task => (
                                <li key={task.id} onClick={() => handleTaskSelect(task)} className="task-item">
                                    {task.id} - {task.name}
                                </li>
                            ))}
                    </ul>
                    <button className="add-task-button" onClick={() => navigate(`/tasks/create?orderId=${orderId}`)}>
                        Добавить новую задачу
                    </button>
                </div>
            </MyModal>

        </div>
    );
};

export default OrderDetailPage;
