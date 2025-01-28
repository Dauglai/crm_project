import React, {useEffect, useState} from "react";
import ProductService from "./API/ProductService";

const ProductModal = ({ formData, setFormData, editingProductId, setEditingProductId, closeModal, refreshProducts }) => {
    const productService = new ProductService('http://localhost:8000');

    // Обработка изменения полей формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Обработка отправки формы
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProductId) {
                await productService.updateProduct(editingProductId, formData);
            } else {
                await productService.createProduct(formData);
            }
            refreshProducts(); // Обновление списка продуктов
            closeModal(); // Закрытие модального окна
        } catch (error) {
            console.error('Ошибка при сохранении продукта.');
        }
    };


    return (
        <form onSubmit={handleFormSubmit} className="product-form">
            <h3>{editingProductId ? 'Редактировать продукт' : 'Добавить новый продукт'}</h3>
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
                {editingProductId ? 'Обновить' : 'Добавить'}
            </button>
        </form>
    );
};

export default ProductModal;
