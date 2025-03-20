import React, { useState, useEffect } from 'react';
import ProductService from "../../components/API/ProductService";
import GroupService from "../../components/API/GroupService";
import './ProductManager.css';
import MyModal from "../../components/UI/MyModal/MyModal";
import ProductModal from "../../components/Products/ProductManagerModal";
import GroupModal from "../../components/Groups/GroupModal";
import '../../styles/Group.css';
import FileManager from "../../components/FileManager/FileManager";
import MyInput from "../../components/UI/input/MyInput";
import {useTasks} from "../../hooks/useTasks";
import MyButton from "../../components/UI/button/MyButton";

const ProductsPage = () => {
    const productService = new ProductService('http://localhost:8000');
    const groupService = new GroupService('http://localhost:8000');
    const [products, setProducts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        group: '',
        name: '',
        price: '',
        count: '',
        article: '',
        description: '',
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [formDataGroup, setFormDataGroup] = useState({ name: '' });
    const [modalVisibleGroup, setModalVisibleGroup] = useState(false);
    const [filter, setFilter] = useState({ sort: '', query: '',});
    const sortedAndSearchedProducts = useTasks(products, filter.sort, filter.query);

    useEffect(() => {
        loadGroups();
    }, []);


    useEffect(() => {
        if (selectedGroup) {
            loadProducts(selectedGroup);
        }
    }, [selectedGroup]);



    const handleEditGroup = (group) => {
        setFormData(group);
        setSelectedGroup(group.id);
    };

    const handleDeleteGroup = async (id) => {
        try {
            await groupService.deleteGroup(id);
            loadGroups();
        } catch (error) {
            console.error(error.message);
        }
    };

    // Загрузка групп
    const loadGroups = async () => {
        try {
            const data = await groupService.fetchGroups();
            setGroups(data);
        } catch (error) {
            console.error('Ошибка при загрузке групп.');
        }
    };
    const showGroupModal = (group = null) => {
        if (group) {
            setSelectedGroup(group.id);
            setFormDataGroup({name: group.name,});
        } else {
            setSelectedGroup(null);
            setFormDataGroup({name: ''});
        }
        setModalVisibleGroup(true);
    };


    const showProductModal = (product = null) => {
        if (product) {
            setEditingProductId(product.id);
            setFormData({
                group: product.group,
                name: product.name,
                price: product.price,
                count: product.count,
                article: product.article,
                description: product.description,
            });
        } else {
            setEditingProductId(null);
            setFormData({
                group: selectedGroup,
                name: '',
                price: '',
                count: '',
                article: '',
                description: '',
            });
        }
        setModalVisible(true);
    };

    // Загрузка продуктов по группе
    const loadProducts = async (group) => {
        try {
            const data = await productService.fetchProducts({ group });
            setProducts(data);
        } catch (error) {
            console.error('Ошибка при загрузке продуктов.');
        }
    };

    const handleProductsDelete = async (productId) => {
        try {
            await productService.deleteProduct(productId);
            if (selectedGroup) {
                loadProducts(selectedGroup);
            }
        } catch (error) {
            console.error('Ошибка при удалении продукта.');
        }
    };


    return (
        <div className="product-manager">
            <h2>Номенклатура</h2>
            <div className="group-list">
                <div className="group-add">
                    <h3>Группы</h3>
                    <button className="icon-button" onClick={() => showGroupModal()}>
                        <img src="/images/icons/plus.svg" alt="Экспорт"/>
                    </button>
                </div>

                <ul>
                    {groups.map((group) => (
                        <li
                            key={group.id}
                            className={`group-item ${selectedGroup === group.id ? 'selected' : ''}`}
                            onClick={() => setSelectedGroup(group.id)}
                        >
                            {group.name}
                            {/*
                            Форма добавления/редактирования группы
                            <button onClick={() => handleEditGroup(group)}>Редактировать</button>
                            <button onClick={() => handleDeleteGroup(group.id)}>Удалить</button>
                            */}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="product-section">
                <div className="product-list">

                    <div className="product-add">
                        <MyInput
                            value={filter.query}
                            onChange={(e) => setFilter({...filter, query: e.target.value})}
                            placeholder="Поиск продуктов"
                        />

                        <button className="icon-button" onClick={() => showProductModal()}>
                            <img src="/images/icons/plus.svg" alt="Экспорт"/>
                        </button>
                        <FileManager/>
                    </div>

                    {sortedAndSearchedProducts.length > 0 ? (
                        <ul>
                            {sortedAndSearchedProducts.map((product) => (
                                <li key={product.id} className="product-item">
                                    <p>
                                        <strong>{product.name}</strong> - {product.price} руб. - {product.count} шт.
                                    </p>
                                    <p>Артикул: {product.article}</p>
                                    <p>Описание: {product.description}</p>

                                    <button onClick={() => showProductModal(product)}>Редактировать</button>
                                    <button onClick={() => handleProductsDelete(product.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Нет продуктов для отображения</p>
                    )}
                </div>
            </div>

            {modalVisible && (
                <MyModal visible={modalVisible} setVisible={setModalVisible}>
                    <ProductModal
                        formData={formData}
                        setFormData={setFormData}
                        editingProductId={editingProductId}
                        setEditingProductId={setEditingProductId}
                        closeModal={() => setModalVisible(false)}
                        refreshProducts={() => loadProducts(selectedGroup)}
                    />
                </MyModal>
            )}
            {modalVisibleGroup && (
                <MyModal visible={modalVisibleGroup} setVisible={setModalVisibleGroup}>
                    <GroupModal
                        formData={formDataGroup}
                        setFormData={setFormDataGroup}
                        editingGroupId={selectedGroup}
                        setEditingGroupId={setSelectedGroup}
                        closeModal={() => setModalVisibleGroup(false)}
                        refreshGroups={loadGroups(selectedGroup)}
                    />
                </MyModal>
            )}

        </div>
    );
};

export default ProductsPage;
