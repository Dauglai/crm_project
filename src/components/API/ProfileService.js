import axios from 'axios'

export default class ProfileService {
    static async getAll() {
        const response = await axios.get('http://localhost:8000/accounts/profile/',
            {withCredentials: true});
        // console.log(response.data)
        return response.data;
    }

    static async getbyId(id) {
        const response = await axios.get(`http://127.0.0.1:8000/accounts/profile/` + id,
            {withCredentials: true});
        // console.log(response.data)
        return response.data;
    }

}