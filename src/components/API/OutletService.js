import axios from 'axios';

class OutletService {
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
    async fetchOutlets(filters = {}) {
        try {
            const response = await axios.get(`${this.baseURL}/outlets/`, {
                withCredentials: true,
            });
            return response.data.results;
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
            throw error;
        }
    }

    // Создание продукта
    async createOutlet(outletData) {
        try {
            await axios.post(
                `${this.baseURL}/outlets/`,
                outletData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            throw error;
        }
    }

    // Обновление продукта
    async updateOutlet(outletId, outletData) {
        try {
            await axios.put(
                `${this.baseURL}/outlets/${outletId}/`,
                outletData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            throw error;
        }
    }

    // Удаление продукта
    async deleteOutlet(outletId) {
        try {
            await axios.delete(
                `${this.baseURL}/outlets_delete/${outletId}/`,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            throw error;
        }
    }
}

export default OutletService;
