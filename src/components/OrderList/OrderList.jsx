import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderList.css";
import api from "../../configs/api";
import {useNavigate} from "react-router-dom"; // Подключаем стили

const OrderList = ({ currentUser }) => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/");
            const allOrders = response.data.results;
            // Фильтруем заказы: если не админ, показываем только свои
            setOrders(allOrders);
        } catch (error) {
            console.error("Ошибка загрузки заказов:", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const filteredOrders = orders.filter(order =>
        order.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="order-container">
            <h2>Список заказов</h2>
            <input
                type="text"
                placeholder="Поиск по описанию..."
                value={search}
                onChange={handleSearchChange}
                className="search-input"
            />
            <ul className="order-list">
                {filteredOrders.map(order => (
                    <li key={order.id} className="order-item">
                        <div className="order-header">
                            <strong onClick={() => navigate("/orders/" + order.id)}>Заказ #{order.id}</strong>
                            <span className="order-outlet">{order.outlet}</span>
                        </div>
                        <p>{order.description}</p>
                        <strong>Товары:</strong>
                        <ul className="order-items">
                            {order.items.map(item => (
                                <li key={item.id}>{item.name} - {item.quantity} шт.</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
