import {Button} from '@mui/material';
import '../css/StylesGeneral.css'
import { BASIC_BTN } from '../css/StylesGeneral';
import { useRef, useState } from 'react';
import dollarImg from '../assets/images/dollar.svg';
import { useAuth } from '../hooks/useAuth';
import PasswordInputWithToggle from '../components/Inputs/PasswordInputWithToggle';
import InputText from '../components/Inputs/InputText';
import { useLocation, useNavigate } from 'react-router-dom';
import Mensaje from '../components/Mensajes/Mensaje';
import { loginUser, validarLogin } from '../utils/logicaLoginUtil';
import LoadingBlocker from '../components/Loaders/LoadingBlocker';

const STYLES = {
  input: { width: "100%", my: 1 }
};

const Login = () => {
  
  const navigate = useNavigate();
  const location = useLocation();

  const {login} = useAuth();

  const loginRef = useRef(null);

  const [credenciales, setCredenciales] = useState({
    username: '',
    password: ''
  });

  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [mensajeLogin, setMostrarMensaje] = useState(false);
  const [loading, setLoading] = useState(false);

  const cerrarMensaje = () => setMostrarMensaje(false);

  const submitForm = async(e) => {
    setLoading(true);
    e.preventDefault();
    if(!validarLogin(credenciales, setErrorUsername, setErrorPassword)){
      setLoading(false);
      return;
    }
    
    const response = await loginUser(credenciales);

    if (response.success) {
      login(response.token);
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace:true });
    } else {
      setLoginError(response.message);
      setMostrarMensaje(true);
    }
    setLoading(false);
  };


  return (
    <>
      <Mensaje open={mensajeLogin} onClose={cerrarMensaje}
        severity='warning'>
        {loginError}
      </Mensaje>
      <div className='fondoLogin'>
        <div className='login-seccion-izquierda'>
          <img src={dollarImg} loading="lazy"
            alt='Ilustración de dolar'
            className='rotating-image'/>
          <h1>Fondo de ahorro</h1>
        </div>
        <div ref={loginRef} className='card'>
          <form onSubmit={submitForm}>
            <h1>Bienvenido Miembro</h1>
            <div className="card-content">
              <p>Por favor ingrese su usuario y contraseña</p>

              <InputText
                style={STYLES.input}
                label="Usuario o correo electronico"
                value={credenciales.username}
                onChange={ (e) => setCredenciales({...credenciales, username : e.target.value})}
                error={errorUsername}
                setError={setErrorUsername}/>

              <PasswordInputWithToggle 
                label={"Contraseña"}
                value={credenciales.password}
                onChange={(e) => setCredenciales({...credenciales, password : e.target.value})}
                error={errorPassword}
                setError={setErrorPassword}/>

              <Button 
                type='submit'
                sx={BASIC_BTN} variant="contained">Ingresar</Button>

              <LoadingBlocker open={loading} parentRef={loginRef}/>

            </div>
          </form>
        </div>
      
      
      </div>    
    </>
  );
}

export default Login;