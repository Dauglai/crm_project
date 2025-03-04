import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetailPage.css";
import MyModal from "../../components/UI/MyModal/MyModal";
import MyButton from "../../components/UI/button/MyButton";
import MyInput from "../../components/UI/input/MyInput";

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [task, setTask] = useState(null);
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
                setOrder(response.data);
                if (response.data.task) {
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

    const handleTaskSelect = async (selectedTask) => {
        try {
            await axios.patch(`http://localhost:8000/task/${selectedTask.id}/`, { order: order.id }, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
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
                        <p><strong>Точка продажи:</strong> {order.outlet?.name || "Не указана"}</p>
                        <p><strong>Клиент:</strong> {order.client?.name || "Не указан"}</p>
                        <p><strong>Описание:</strong> {order.description || "Без описания"}</p>
                        <MyButton onClick={() => setShowTaskModal(true)}>Привязать задачу</MyButton>
                    </div>

                    {splitScreen && task && (
                        <div className="task-section">
                            <h2>Привязанная задача</h2>
                            <p><strong>Название:</strong> {task.name}</p>
                            <p><strong>Статус:</strong> {task.status}</p>
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
                        {tasks.filter(task => task.name.toLowerCase().includes(search.toLowerCase()))
                            .map((task) => (
                                <li key={task.id} onClick={() => handleTaskSelect(task)} className="task-item">
                                    {task.id} - {task.name}
                                </li>
                            ))}
                    </ul>
                    <button className="add-task-button" onClick={() => navigate(`/tasks/create?orderId=${orderId}`)}>Добавить новую задачу</button>
                </div>
            </MyModal>

            <button onClick={() => setSplitScreen(!splitScreen)}>
                {splitScreen ? "Скрыть задачу" : "Показать задачу"}
            </button>
        </div>
    );
};

export default OrderDetailPage;