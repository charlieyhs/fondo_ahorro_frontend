import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";
import apiClient from "../utils/apiClient";

export const AuthProvider = ({ children }) => {

    const [tokens, setTokens] = useState({
      accessToken: null,
      refreshToken: null,
    });
    
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

          const refreshToken = sessionStorage.getItem('refreshToken');

          if(error.response?.status === 401 && refreshToken && !orig._retry){
            orig._retry = true;
            try{
              const { data } = await apiClient.post('/auth/refresh', null, {
                params : [refreshToken]
              });
              
              const { accessToken, refreshToken: newRefresh } = data.data;

              setTokens( {
                accessToken,
                refreshToken : newRefresh
              });
              sessionStorage.setItem('accessToken', accessToken);
              sessionStorage.setItem('refreshToken', newRefresh);
  
              orig.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
              return apiClient(orig);
            }catch(refreshError){
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

    
    const login = useCallback(({accessToken, refreshToken, provisional = false}) => {
      if(provisional){
        sessionStorage.setItem('accessSelectRole', accessToken);
        sessionStorage.setItem('accessSelectRole_expiry', Date.now() + 5 * 60 * 1000); // 5 minutos
      }else{
        setTokens({
          accessToken : accessToken,
          refreshToken : refreshToken
        });
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('accessToken', accessToken);
      }
     
      setTokens(prev => ({
        ...prev,
        accessToken : accessToken
      }));
      
      if (refreshToken) {
        setTokens(prev => ({
          ...prev,
          refreshToken : refreshToken
        }));
      }
    }, []);
    const applySelectedRole = useCallback(({accessToken, refreshToken}) => {
      sessionStorage.removeItem('accessSelectRole');
      sessionStorage.removeItem('accessSelectRole_expiry');

      sessionStorage.setItem('accessToken', accessToken);
      setTokens(prev => ({
        ...prev,
        accessToken : accessToken
      }));


      if(refreshToken){
        sessionStorage.setItem('refreshToken', refreshToken);
        setTokens(prev => ({
          ...prev,
          refreshToken : refreshToken
        }));
      }
    },[]);
    const logout = useCallback(async() => {
      await apiClient.post('/auth/logout');
      setTokens({
        accessToken : null,
        refreshToken : null
      });
      sessionStorage.clear();
    },[]);

    const isAuthenticated = useCallback(() => {
      return !!tokens.accessToken;
    }, [tokens.accessToken]);
    
    const contextValue = useMemo(() => ({
      login,
      logout,
      applySelectedRole,
      isAuthenticated
    }), [login, logout, applySelectedRole, isAuthenticated]);

    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  AuthProvider.propTypes = {
      children : PropTypes.node.isRequired
  };