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

let refreshTokenPromise = null;

// Renovar en status 401
apiClient.interceptors.response.use(
res => res,
async error => {
    const originalRequest  = error.config;
    if(error.response?.status === 401
        && !originalRequest._retry
        && !originalRequest.url.includes('/auth/refresh-token') ){
        originalRequest._retry = true;
        if(!refreshTokenPromise){
            refreshTokenPromise = (async () =>{
                try{
                    const { data } = await apiClient.post('/auth/refresh-token', {});
                    
                    const { accessToken } = data.data;
                    sessionStorage.setItem(ACCESS_TOKEN, accessToken);
                    return accessToken;
    
                }catch(refreshError){
                    sessionStorage.removeItem(ACCESS_TOKEN);
                    window.location.href = '/login';
                    throw refreshError;
                }finally{
                    refreshTokenPromise = null;
                }
            })();
        }
        try{
            const newToken = await refreshTokenPromise;   
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
        }catch(refreshError){
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
}
);

export default apiClient;