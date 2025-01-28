import axios from 'axios';

class ProductService {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.csrfToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken'))
            ?.split('=')[1];

        this.configData = {
            headers: {
                'X-CSRFToken': this.csrfToken,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
    }

    // Получение списка продуктов
    async fetchProducts(filters = {}) {
        try {
            const response = await axios.get(`${this.baseURL}/products/`, {
                withCredentials: true,
                params: {group: filters.group},
            });
            return response.data.results;
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
            throw error;
        }
    }

    // Создание продукта
    async createProduct(productData) {
        try {
            await axios.post(
                `${this.baseURL}/products/`,
                productData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            throw error;
        }
    }

    // Обновление продукта
    async updateProduct(productId, productData) {
        try {
            await axios.put(
                `${this.baseURL}/products/${productId}/`,
                productData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            throw error;
        }
    }

    // Удаление продукта
    async deleteProduct(productId) {
        try {
            await axios.delete(
                `${this.baseURL}/products_delete/${productId}/`,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            throw error;
        }
    }
}

export default ProductService;
