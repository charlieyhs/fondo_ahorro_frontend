import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import { useEffect } from 'react';

const App = () => {
  const navigate = useNavigate();
  
  useEffect(() =>{
    document.title= 'Fondo ahorro';
    const authToken = localStorage.getItem('authToken');
    navigate(authToken ? '/home' : 'login');
  }, [navigate]);


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      {/* Redirige la ruta raíz a /login o /home según la autenticación */}
      <Route path="*" element={ <Navigate to="/home" replace /> }
      />
    </Routes>
  );
}

export default App;