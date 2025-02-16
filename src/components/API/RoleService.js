import axios from 'axios';

class RoleService {
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
    async fetchRoles(filters = {}) {
        try {
            const response = await axios.get(`${this.baseURL}/roles/`, {
                withCredentials: true,
                params: {outlet: filters.outlet},
            });
            return response.data.results;
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
            throw error;
        }
    }

    // Создание продукта
    async createRole(groupData) {
        try {
            await axios.post(
                `${this.baseURL}/roles/`,
                groupData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            throw error;
        }
    }

    // Обновление продукта
    async updateRole(Id, groupData) {
        try {
            await axios.put(
                `${this.baseURL}/roles/${Id}/`,
                groupData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            throw error;
        }
    }

    // Удаление продукта
    async deleteRole(Id) {
        try {
            await axios.delete(
                `${this.baseURL}/roles/${Id}/`,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            throw error;
        }
    }
}

export default RoleService;
