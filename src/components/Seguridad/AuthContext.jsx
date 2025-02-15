import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [tokenUser, setTokenUser] = useState(null);

  const login = (credentials) => {
    // cookies HTTPOnly
    setTokenUser('CHARLIE');
    localStorage.setItem('authToken', tokenUser);
  };

  const isAuthenticated = () =>{
    console.log('CHARLIE');
    return !!localStorage.getItem('authToken');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setTokenUser(null);
  };

  return (
    <AuthContext.Provider value={{ tokenUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children : PropTypes.node.isRequired
};

export default AuthContext;