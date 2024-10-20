import axios from 'axios'

export default class TaskService {
    static async getAll(limit = 10, page = 1) {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
                params: {
                    _limit: limit,
                    _page: page
                }
            }
        )
        // console.log(response.data)
        return response
    }

    static async getbyId(id) {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/` + id)
        // console.log(response.data)
        return response
    }

    static async getbyIdComment(id) {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
        // console.log(response.data)
        return response
    }
}