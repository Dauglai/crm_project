import axios from 'axios'

export default class TaskService {
    static async getAll(limit = 10, page = 1) {
        const response = await axios.get('http://127.0.0.1:8000/task/', {
                params: {
                    _limit: limit,
                    _page: page
                },
                withCredentials: true
            }
        );
        // console.log(response.data)
        return response;
    }

    static async getbyId(id) {
        const response = await axios.get(`http://127.0.0.1:8000/task/` + id,
            {withCredentials: true});
        // console.log(response.data)
        return response;
    }

    static async getbyIdComment(id) {
        const response = await axios.get(`http://127.0.0.1:8000/task/ ${id}/comments`,
            {withCredentials: true});
        // console.log(response.data)
        return response;
    }
}