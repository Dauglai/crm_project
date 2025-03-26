import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderForm.css";
import MyInput from "../../components/UI/input/MyInput";

const OrderForm = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [clients, setClients] = useState([]);
    // selectedItems – массив объектов: { product: productId, quantity: число }
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedOutlet, setSelectedOutlet] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [description, setDescription] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Параметры пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        // Загрузка данных при монтировании компонента
        const fetchData = async () => {
            try {
                const [productsResponse, outletsResponse, clientsResponse] = await Promise.all([
                    axios.get("http://localhost:8000/products/", { withCredentials: true }),
                    axios.get("http://localhost:8000/outlets/", { withCredentials: true }),
                    axios.get("http://localhost:8000/clients/", { withCredentials: true }),
                ]);

                setProducts(productsResponse.data.results);
                setFilteredProducts(productsResponse.data.results);
                setOutlets(outletsResponse.data.results);
                setClients(clientsResponse.data.results);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchData();
    }, []);

    // Фильтрация продуктов по поисковому запросу
    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
        setCurrentPage(1); // сброс страницы при новом запросе
    }, [searchQuery, products]);

    // Пагинация
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Добавление/удаление товара с количеством
    const handleItemToggle = (productId) => {
        const existingItem = selectedItems.find(item => item.product === productId);
        if (existingItem) {
            // Удаляем товар из списка, если уже выбран
            setSelectedItems(selectedItems.filter(item => item.product !== productId));
        } else {
            // Добавляем товар с количеством по умолчанию (например, 1)
            setSelectedItems([...selectedItems, { product: productId, quantity: 1 }]);
        }
    };

    // Изменение количества для выбранного товара
    const handleQuantityChange = (productId, quantity) => {
        setSelectedItems(selectedItems.map(item =>
            item.product === productId ? { ...item, quantity: Number(quantity) } : item
        ));
    };

    const [showClientModal, setShowClientModal] = useState(false);
    const [newClientName, setNewClientName] = useState("");

    const handleAddClient = async () => {
        if (!newClientName.trim()) {
            alert("Введите имя клиента");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/clients/",
                { name: newClientName },
                { withCredentials: true }
            );

            setClients([...clients, response.data]); // Добавляем клиента в список
            setSelectedClient(response.data.id); // Сразу выбираем его
            setNewClientName("");
            setShowClientModal(false);
        } catch (error) {
            console.error("Ошибка при добавлении клиента:", error);
            alert("Ошибка при добавлении клиента");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Формирование данных заказа
        const orderData = {
            outlet: selectedOutlet,
            client: selectedClient,
            description,
            items: selectedItems, // ожидается список объектов { product, quantity }
        };

        const csrfToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrftoken"))
            ?.split("=")[1];

        try {
            await axios.post("http://localhost:8000/orders/create/", orderData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
            });
            alert("Заказ успешно создан");
            // Очистка формы при успехе
            setSelectedItems([]);
            setSelectedOutlet("");
            setSelectedClient("");
            setDescription("");
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
            alert("Ошибка при создании заказа");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="order-form">
            <h2>Создание заказа</h2>

            {/* Поиск продуктов */}
            <div className="form-group">
                <label>Поиск продукта:</label>
                <MyInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введите название продукта"
                />
            </div>

            {/* Список продуктов с пагинацией */}
            <div className="form-group">
                <label>Продукты:</label>
                <div className="product-list">
                    {currentProducts.map((product) => {
                        const selectedItem = selectedItems.find(item => item.product === product.id);
                        return (
                            <div key={product.id} className="product-item">
                                <input
                                    type="checkbox"
                                    id={`product-${product.id}`}
                                    checked={!!selectedItem}
                                    onChange={() => handleItemToggle(product.id)}
                                />
                                <label htmlFor={`product-${product.id}`}>{product.name}</label>
                                {selectedItem && (
                                    <input
                                        type="number"
                                        min="1"
                                        value={selectedItem.quantity}
                                        onChange={(e) =>
                                            handleQuantityChange(product.id, e.target.value)
                                        }
                                        className="quantity-input"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Пагинация */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            type="button"
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={currentPage === index + 1 ? "active-page" : ""}
                        >
                            {index + 1}
                        </button>
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

            <div className="form-group">
                <label>Клиент:</label>
                <div className="client-selection">
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
                    <button type="button" className="add-client-btn" onClick={() => setShowClientModal(true)}>
                        Добавить клиента
                    </button>
                </div>
            </div>

            {/* Модальное окно для добавления клиента */}
            {showClientModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Добавить клиента</h3>
                        <input
                            type="text"
                            placeholder="Имя клиента"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                        />
                        <button onClick={handleAddClient}>Добавить</button>
                        <button onClick={() => setShowClientModal(false)}>Закрыть</button>
                    </div>
                </div>
            )}


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

        </form>
    );
};

export default OrderForm;
