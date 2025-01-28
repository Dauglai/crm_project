import axios from 'axios';

class GroupService {
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
    async fetchGroups() {
        try {
            const response = await axios.get(`${this.baseURL}/groups/`, {
                withCredentials: true,
            });
            return response.data.results;
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
            throw error;
        }
    }

    // Создание продукта
    async createGroup(groupData) {
        try {
            await axios.post(
                `${this.baseURL}/groups/`,
                groupData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            throw error;
        }
    }

    // Обновление продукта
    async updateGroup(Id, groupData) {
        try {
            await axios.put(
                `${this.baseURL}/groups/${Id}/`,
                groupData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            throw error;
        }
    }

    // Удаление продукта
    async deleteGroup(Id) {
        try {
            await axios.delete(
                `${this.baseURL}/groups/${Id}/`,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            throw error;
        }
    }
}

export default GroupService;
