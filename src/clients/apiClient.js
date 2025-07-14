import axios from "axios";
import { ACCESS_ROLE, ACCESS_TOKEN } from "../constants/storageKeys";

const apiClient = axios.create({
    baseURL : import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers : {"Content-Type" : "application/json"}
});

// Adjuntar access token
apiClient.interceptors.request.use(config => {
    const token = sessionStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_ROLE);
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Renovar en status 401
apiClient.interceptors.response.use(
res => res,
async error => {
    const orig = error.config;
    if(error.response?.status === 401
        && !orig._retry
        && !orig.url.includes('/auth/refresh-token') ){
    orig._retry = true;
        try{
            const { data } = await apiClient.post('/auth/refresh-token', {});
            
            const { accessToken } = data.data;
            sessionStorage.setItem(ACCESS_TOKEN, accessToken);

            orig.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
            return apiClient(orig);
        }catch(refreshError){
            sessionStorage.removeItem(ACCESS_TOKEN);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
}
);

export default apiClient;