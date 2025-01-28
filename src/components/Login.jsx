import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../css/StylesGeneral.css'
import PasswordInput from './PasswordInputWithToggle'
import { BASIC_BTN } from '../css/StylesGeneral';

function Login() {


  return (
    <>
      <div className='fondoLogin'>
      <div className='login-seccion-izquierda'>
        <img src='src\assets\images\dollar.png'
          alt='Imagen de una moneda de dolar'
          className='rotating-image'
          style={{mr:'100px'}}/>
        <h1>Fondo de ahorro</h1>
      </div>
      <div className="card">
        <div className="card-title">Bienvenido Miembro</div>
        <div className="card-content">
          <br/>
          Por favor ingrese su usuario y contraseña
          <br/>
          <br/>
          <TextField fullWidth  id="inputUsuario" 
            label="Usuario o correo electronico" 
            variant="outlined" />

          <PasswordInput />
          <Button sx={BASIC_BTN} variant="outlined">Ingresar</Button>
        </div>
      </div>
      </div>    
    </>
  );
}

export default Login;