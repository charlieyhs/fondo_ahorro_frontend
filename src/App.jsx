import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useEffect } from 'react';
import PrivateRoute from './components/Seguridad/PrivateRoute';

const App = () => {
  
  useEffect(() =>{
    document.title= 'Fondo ahorro';     
  }, []);


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/*Rutas protegidas */ }
      <Route path="/home" element={
        <PrivateRoute>
          <Home/>
        </PrivateRoute>
      }/>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;