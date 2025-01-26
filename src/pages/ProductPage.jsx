import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProductManager.css";

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        group: "",
        name: "",
        price: "",
        count: "",
        article: "",
        description: "",
    });
    const [editingProductId, setEditingProductId] = useState(null);

    // Загрузка списка продуктов
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/products/", {
                withCredentials: true,
            });
            setProducts(response.data.results);
        } catch (error) {
            console.error("Ошибка при загрузке продуктов:", error);
        }
    };

    const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken"))
        ?.split("=")[1];

    // Обработка изменения полей формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Добавление или обновление продукта
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProductId) {
                // Редактирование продукта
                await axios.put(`http://localhost:8000/products/${editingProductId}/`, formData, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true,
                });
                alert("Продукт успешно обновлен");
            } else {
                // Добавление нового продукта
                await axios.post("http://localhost:8000/products/", formData, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                alert("Продукт успешно добавлен");
            }
            fetchProducts(); // Обновляем список продуктов
            setFormData({
                group: "",
                name: "",
                price: "",
                count: "",
                article: "",
                description: "",
            });
            setEditingProductId(null);
        } catch (error) {
            console.error("Ошибка при сохранении продукта:", error);
            alert("Ошибка при сохранении продукта");
        }
    };

    // Удаление продукта
    const handleDelete = async (productId) => {
        if (window.confirm("Вы уверены, что хотите удалить этот продукт?")) {
            try {
                await axios.delete(`http://localhost:8000/products_delete/${productId}/`, {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                });
                alert("Продукт успешно удален");
                fetchProducts();
            } catch (error) {
                console.error("Ошибка при удалении продукта:", error);
                alert("Ошибка при удалении продукта");
            }
        }
    };

    // Заполнение формы для редактирования продукта
    const handleEdit = (product) => {
        setEditingProductId(product.id);
        setFormData({
            group: product.group,
            name: product.name,
            price: product.price,
            count: product.count,
            article: product.article,
            description: product.description,
        });
    };

    return (
        <div className="product-manager">
            <h2>Управление продуктами</h2>

            {/* Форма добавления/редактирования продукта */}
            <form onSubmit={handleSubmit} className="product-form">
                <div>
                    <label>Группа:</label>
                    <input
                        type="text"
                        name="group"
                        value={formData.group}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Цена:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Количество:</label>
                    <input
                        type="number"
                        name="count"
                        value={formData.count}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Артикул:</label>
                    <input
                        type="number"
                        name="article"
                        value={formData.article}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">
                    {editingProductId ? "Обновить продукт" : "Добавить продукт"}
                </button>
            </form>

            {/* Список продуктов */}
            <div className="product-list">
                <h3>Список продуктов</h3>
                {products.length > 0 ? (
                    <ul>
                        {products.map((product) => (
                            <li key={product.id} className="product-item">
                                <p>
                                    <strong>{product.name}</strong> - {product.price} руб. -{" "}
                                    {product.count} шт.
                                </p>
                                <p>Артикул: {product.article}</p>
                                <p>Описание: {product.description}</p>
                                <button onClick={() => handleEdit(product)}>Редактировать</button>
                                <button onClick={() => handleDelete(product.id)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет продуктов для отображения</p>
                )}
            </div>
        </div>
    );
};

export default ProductManager;
