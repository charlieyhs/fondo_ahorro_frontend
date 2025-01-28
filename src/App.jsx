import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Login from './components/login';
import Home from './components/Home';
import { useEffect } from 'react';

function App() {
  useEffect(() =>{
    document.title= 'Fondo ahorro';
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario está autenticado
    const isAuthenticated = !!localStorage.getItem('authToken'); // Ejemplo simple

    if (!isAuthenticated) {
      // Redirige a la página de login si no está autenticado
      navigate('/login');
    } else {
      // Redirige al dashboard si está autenticado
      navigate('/dashboard');
    }
  }, [navigate]); // Dependencia: navigate

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Home />} />
      {/* Redirige la ruta raíz a /login o /dashboard según la autenticación */}
      <Route path="/"
        element={
          localStorage.getItem('authToken') ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)
        }
      />
    </Routes>
  );
}

export default App;