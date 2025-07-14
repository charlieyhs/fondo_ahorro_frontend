import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingBlocker from '../components/Loaders/LoadingBlocker';
import { useRef, useState } from 'react';
import Sidebar from '../components/menus/Sidebar';

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate('/login');
  };
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(null);

  return (
    <>
      
      <Sidebar />
      <div style={styles.container} ref={loadingRef}>
        <h1>Bienvenido al Fondo de Ahorro</h1>
        <p>Aquí puedes ver el estado de tus ahorros.</p>
        
        {/* Botón de cerrar sesión */}
        <button onClick={handleLogout} style={styles.button}>
          Cerrar sesión
        </button>

        <LoadingBlocker open={loading} parentRef={loadingRef}/>

      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default Home;