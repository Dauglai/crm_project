import axios from 'axios'

export default class TaskService {
    static async getAll(filter, limit = 10, page = 1) {
        const response = await axios.get('http://localhost:8000/task/', {
            params: {
                page_size: limit,
                page: page,
                query: filter.query,
                ordering: filter.sort,
                role: filter.role,
            },
            withCredentials: true,
        });
        return response.data.results; // Возвращаем только данные
    }

    static async getbyId(id) {
        const response = await axios.get(`http://127.0.0.1:8000/task/` + id,
            {withCredentials: true});
        return response.data.results;
    }

    static async getbyIdComment(id) {
        const response = await axios.get(`http://127.0.0.1:8000/task/${id}/comments`,
            {withCredentials: true});
        return response.data.results;
    }

    static async createComment(taskId, data) {
        axios.post(`http://localhost:8000/task/${taskId}/comment/`, data, {withCredentials: true});
    }
}