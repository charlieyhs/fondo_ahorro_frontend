import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div style={styles.container}>
      <h1>Bienvenido al Fondo de Ahorro</h1>
      <p>Aquí puedes ver el estado de tus ahorros.</p>
      
      {/* Botón de cerrar sesión */}
      <button onClick={handleLogout} style={styles.button}>
        Cerrar sesión
      </button>
    </div>
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