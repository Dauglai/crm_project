import React, { useState, useEffect } from 'react';
import ProductService from "../components/API/ProductService";
import GroupService from "../components/API/GroupService";
import '../styles/ProductManager.css';
import MyModal from "../components/UI/MyModal/MyModal";
import ProductModal from "../components/ProductManagerModal";
import GroupModal from "../components/GroupModal";
import '../styles/Group.css';
import ProductFileManager from "../components/ProductFileManager";

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


    useEffect(() => {
        loadGroups();
    }, []);


    useEffect(() => {
        if (selectedGroup) {
            loadProducts(selectedGroup);
        }
    }, [selectedGroup]);

    // Загрузка продуктов по группе
    const loadProducts = async (group) => {
        try {
            const data = await productService.fetchProducts({ group });
            setProducts(data);
        } catch (error) {
            console.error('Ошибка при загрузке продуктов.');
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

    // Открытие модального окна для добавления или редактирования
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

    // Удаление продукта
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
                <h3>Группы</h3>
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
                <button onClick={() => showGroupModal()}>Добавить новую группу</button>
            </div>
            <div className="product-section">
                <div className="product-list">
                    <ProductFileManager />
                    <button onClick={() => showProductModal()}>Добавить новый продукт</button>
                    {products.length > 0 ? (
                        <ul>
                            {products.map((product) => (
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
