import axios from 'axios';

class ProfileService {
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
    async fetchProfiles(filters = {}) {
        try {
            const response = await axios.get(`${this.baseURL}/accounts/profile/`, {
                withCredentials: true,
            });
            return response.data.results;
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
            throw error;
        }
    }

    // Обновление продукта
    async updateProfile(productId, productData) {
        try {
            await axios.put(
                `${this.baseURL}/accounts/profile/${productId}/`,
                productData,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            throw error;
        }
    }

    async deleteProfile(productId) {
        try {
            await axios.delete(
                `${this.baseURL}/accounts/profile/${productId}/`,
                this.configData
            );
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            throw error;
        }
    }
}

export default ProfileService;
