import {TextField,Button} from '@mui/material';
import '../css/StylesGeneral.css'
import PasswordInput from './PasswordInputWithToggle'
import { BASIC_BTN } from '../css/StylesGeneral';
import { useState } from 'react';
import dollarImg from '../assets/images/dollar.svg';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const { login } = useAuth();

  const submitForm = () => {
    login('your-token-here');
  };


  return (
    <>
      <div className='fondoLogin'>
      <div className='login-seccion-izquierda'>
        <img src={dollarImg} loading="lazy"
          alt='Ilustración de dolar'
          className='rotating-image'/>
        <h1>Fondo de ahorro</h1>
      </div>
      <div className='card'>
        <form onSubmit={submitForm}>
          <h1>Bienvenido Miembro</h1>
          <div className="card-content">
            <p>Por favor ingrese su usuario y contraseña</p>
            <TextField id="inputUsuario" 
              fullWidth
              label="Usuario o correo electronico"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username : e.target.value})}
              sx={{my : 2}}/>

            <PasswordInput 
              label={"Contraseña"}
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password : e.target.value})}/>

            <Button 
              type='submit'
              sx={BASIC_BTN} variant="contained">Ingresar</Button>
          </div>
        </form>
      </div>
      
      
      </div>    
    </>
  );
}

export default Login;