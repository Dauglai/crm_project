import React, { useEffect, useState } from "react";
import ProductService from "./API/ProductService";
import GroupService from "./API/GroupService";
import '../styles/ProductModal.css';

const ProductModal = ({ formData, setFormData, editingProductId, closeModal, refreshProducts }) => {
    const productService = new ProductService('http://localhost:8000');
    const groupService = new GroupService('http://localhost:8000');

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await groupService.fetchGroups();
                setGroups(data);
            } catch (error) {
                console.error("Ошибка загрузки групп", error);
            }
        };
        fetchGroups();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProductId) {
                await productService.updateProduct(editingProductId, formData);
            } else {
                await productService.createProduct(formData);
            }
            refreshProducts();
            closeModal();
        } catch (error) {
            console.error("Ошибка при сохранении продукта.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{editingProductId ? "Редактировать продукт" : "Добавить новый продукт"}</h3>
                <form onSubmit={handleFormSubmit} className="product-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Группа:</label>
                            <select name="group" value={formData.group} onChange={handleInputChange} required>
                                <option value="">Выберите группу</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Название:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required/>
                        </div>
                    </div>


                    <div className="form-columns">
                        <div className="form-left">
                            <div className="form-group">
                                <label>Цена:</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="form-group">
                                <label>Количество:</label>
                                <input type="number" name="count" value={formData.count} onChange={handleInputChange}
                                       required/>
                            </div>
                            <div className="form-group">
                                <label>Артикул:</label>
                                <input type="text" name="article" value={formData.article} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="form-right">
                            <div className="form-group">
                                <label>Описание:</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit">{editingProductId ? "Обновить" : "Добавить"}</button>
                        <button type="button" className="cancel-button" onClick={closeModal}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
