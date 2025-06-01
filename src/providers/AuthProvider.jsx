import { useCallback, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";



export const AuthProvider = ({ children }) => {    
    
    

    const login = useCallback((accessToken) => {
      sessionStorage.setItem('accessToken', accessToken);
    }, []);

    const loginProvisional = useCallback((accessToken) => {
      sessionStorage.setItem('accessSelectRole', accessToken);
      sessionStorage.setItem('accessSelectRole_expiry', Date.now() + 5 * 60 * 1000); // 5 minutos
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