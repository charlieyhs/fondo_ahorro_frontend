import Sidebar from '../components/menus/Sidebar';
import { Box } from '@mui/material';

const drawerWidth = 240;

const Home = () => {
  

  return (
    <div className='divPag'>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`
        }}
      >
        <h1>Bienvenido al Fondo de Ahorro</h1>
        <p>Aquí puedes ver el estado de tus ahorros.</p>
      </Box>
    </div>
  );
};

export default Home;