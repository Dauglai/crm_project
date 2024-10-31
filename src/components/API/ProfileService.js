import axios from 'axios'

export default class ProfileService {
    static async getAll(limit = 10, page = 1) {
        const response = await axios.get('http://127.0.0.1:8000/accounts/profile/', {
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
        const response = await axios.get(`http://127.0.0.1:8000/accounts/profile/` + id,
            {withCredentials: true});
        // console.log(response.data)
        return response;
    }

}