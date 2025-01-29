import { useContext } from 'react';
import AuthContext from '../components/AuthContext'

export const useAuth = () => useContext(AuthContext);