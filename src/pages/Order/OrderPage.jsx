import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderPage.css";

const OrderForm = () => {
    const [products, setProducts] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        // Загрузка данных при монтировании компонента
        const fetchData = async () => {
            try {
                const [productsResponse, outletsResponse, clientsResponse] = await Promise.all([
                    axios.get("http://localhost:8000/products/", {withCredentials: true}),
                    axios.get("http://localhost:8000/outlets/", {withCredentials: true}),
                    axios.get('http://localhost:8000/clients/', {withCredentials: true}),
                ]);

                setProducts(productsResponse.data.results);
                setOutlets(outletsResponse.data.results);
                setClients(clientsResponse.data.results);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchData();
    }, []);

    const handleProductSelect = (productId) => {
        setSelectedProducts((prevSelectedProducts) =>
            prevSelectedProducts.includes(productId)
                ? prevSelectedProducts.filter((id) => id !== productId)
                : [...prevSelectedProducts, productId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            product: selectedProducts,
            outlet: selectedOutlet,
            client: selectedClient,
            description,
        };

        try {
            await axios.post("http://localhost:8000/orders/", orderData, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            });
            alert("Заказ успешно создан");
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            alert("Ошибка при создании заказа");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="order-form">
            <h2>Создание заказа</h2>

            {/* Выбор продуктов */}
            <div className="form-group">
                <label>Продукты:</label>
                <div className="product-list">
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <input
                                type="checkbox"
                                id={`product-${product.id}`}
                                value={product.id}
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleProductSelect(product.id)}
                            />
                            <label htmlFor={`product-${product.id}`}>{product.name}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Выбор точки продажи */}
            <div className="form-group">
                <label>Точка продажи:</label>
                <select
                    name="selectedOutlet"
                    value={selectedOutlet}
                    onChange={(e) => setSelectedOutlet(e.target.value)}
                    required
                >
                    <option value="">Выберите точку продажи</option>
                    {outlets.map((outlet) => (
                        <option key={outlet.id} value={outlet.id}>
                            {outlet.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Выбор клиента */}
            <div className="form-group">
                <label>Клиент:</label>
                <select
                    name="selectedClient"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                >
                    <option value="">Выберите клиента</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Описание */}
            <div className="form-group">
                <label>Описание:</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="1000"
                    required
                />
            </div>

            <button type="submit">Создать заказ</button>
        </form>
    );
};

export default OrderForm;
