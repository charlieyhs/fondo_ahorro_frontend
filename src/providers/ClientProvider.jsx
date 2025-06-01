import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";
import { useCallback, useEffect, useMemo } from "react";
import apiClient from "../utils/apiClient";


export const ClientProvider = ({ children }) => {

    useEffect(() => {
        // Adjuntar access token
        const requestInterceptor = apiClient.interceptors.request.use(config => {
            const token = sessionStorage.getItem('accessToken') || sessionStorage.getItem('accessSelectRole');
            if(token){
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });

        // Renovar en status 401
        const responseInterceptor = apiClient.interceptors.response.use(
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
                    sessionStorage.setItem('accessToken', accessToken);
        
                    orig.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
                    return apiClient(orig);
                }catch(refreshError){
                    sessionStorage.removeItem('accessToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
        );
        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        }
    },[]);

    const logout = useCallback(async() => {
        await apiClient.post('/auth/logout');
        sessionStorage.clear();
    },[]);
    
    const applySelectedRole = useCallback(({accessToken}) => {
        sessionStorage.removeItem('accessSelectRole');
        sessionStorage.removeItem('accessSelectRole_expiry');

        sessionStorage.setItem('accessToken', accessToken);
    },[]);
    
    const isAuthenticated = useCallback(() => {
      return !!sessionStorage.getItem('accessToken');
    }, []);

    const contextValue = useMemo(() => ({
        logout,
        applySelectedRole,
        isAuthenticated
    }), [logout, applySelectedRole, isAuthenticated]);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

ClientProvider.propTypes = {
    children : PropTypes.node.isRequired
};