import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";
import { useCallback, useMemo } from "react";
import apiClient from "../clients/apiClient";
import { ACCESS_ROLE, ACCESS_ROLE_EXPIRY, ACCESS_TOKEN } from "../constants/storageKeys";


export const ClientProvider = ({ children }) => {

    const logout = useCallback(async() => {
        await apiClient.post('/auth/logout');
        sessionStorage.clear();
    },[]);
    
    const applySelectedRole = useCallback(({accessToken}) => {
        sessionStorage.removeItem(ACCESS_ROLE);
        sessionStorage.removeItem(ACCESS_ROLE_EXPIRY);

        sessionStorage.setItem(ACCESS_TOKEN, accessToken);
    },[]);
    
    const isAuthenticated = useCallback(() => {
      return !!sessionStorage.getItem(ACCESS_TOKEN)
            || !!sessionStorage.getItem(ACCESS_ROLE);
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