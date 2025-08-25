import { useEffect, useMemo, useState } from "react";
import apiClient from "../clients/apiClient";
import { ACCESS_TOKEN } from "../constants/storageKeys";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";

export const UserProvider = ({children}) => {

    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try{
                const res = await apiClient.get('/users/me');
                setUser(res.data);
            }catch {
                sessionStorage.removeItem(ACCESS_TOKEN);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);
    const context = useMemo(() => ({
        user, 
        setUser, 
        loading
    }), [user, setUser, loading]);

    return (
        <UserContext.Provider value={context}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children : PropTypes.node.isRequired
};