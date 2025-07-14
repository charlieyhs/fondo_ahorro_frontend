import axios from "axios";

const loginClient = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL + '/auth',
    withCredentials: true
});

export default loginClient;