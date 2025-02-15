import { useContext } from 'react';
import AuthContext from '../components/Seguridad/AuthContext'

export const useAuth = () => useContext(AuthContext);