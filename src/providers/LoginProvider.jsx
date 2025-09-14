import { useCallback, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";
import { ACCESS_ROLE, ACCESS_ROLE_EXPIRY, ACCESS_TOKEN } from "../constants/storageKeys";
import { useNavigate } from "react-router-dom";



export const AuthProvider = ({ children }) => {    
    
    const navigate = useNavigate();

    const login = useCallback((accessToken) => {
      sessionStorage.setItem(ACCESS_TOKEN, accessToken);
      navigate('/home', {replace: true});
    }, [navigate]);

    const loginProvisional = useCallback((accessToken) => {
      sessionStorage.setItem(ACCESS_ROLE, accessToken);
      sessionStorage.setItem(ACCESS_ROLE_EXPIRY, Date.now() + 5 * 60 * 1000); // 5 minutos
    }, []);

    
    
    const contextValue = useMemo(() => ({
      login,
      loginProvisional
    }), [login, loginProvisional]);

    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  AuthProvider.propTypes = {
      children : PropTypes.node.isRequired
  };