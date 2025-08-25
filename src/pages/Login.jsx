import {Button} from '@mui/material';
import '../css/General.css'
import { useRef, useState } from 'react';
import dollarImg from '../assets/images/dollar.svg';
import { useAuth } from '../hooks/useAuth';
import PasswordInputWithToggle from '../components/Inputs/PasswordInputWithToggle';
import InputText from '../components/Inputs/InputText';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from '../components/Messages/Message';
import { loginUser, validateLogin } from '../utils/logicLoginUtil';
import LoadingBlocker from '../components/Loaders/LoadingBlocker';
import { useTranslation } from 'react-i18next';
import { FROM_LOGIN } from '../constants/storageKeys';


const STYLES = {
  input: { width: "100%", my: 1 }
};

const Login = () => {
  
  const {t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const {login, loginProvisional} = useAuth();

  const loginRef = useRef(null);

  const [credenciales, setCredenciales] = useState({
    username: '',
    password: ''
  });

  const [errorUsername, setErrorUsername] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [mensajeLogin, setMensajeLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  

  const cerrarMensaje = () => setMensajeLogin(false);

  const submitForm = async(e) => {
    e.preventDefault();
    setLoading(true);
    if(!validateLogin(credenciales, setErrorUsername, setErrorPassword)){
      setLoading(false);
      return;
    }
    
    const response = await loginUser(credenciales);

    if (response.success) {

      const roles = response.roles || [];

      if(roles.length > 1){
        sessionStorage.setItem(FROM_LOGIN, 'true');
        loginProvisional(response.accessToken);
        navigate('/select-role', { 
          state: { 
            roles: roles,
            from: location.state?.from
          },
          replace: true
        });
      }else{
        login(response.accessToken);
      }

    } else {
      setLoginError(response.message);
      setMensajeLogin(true);
    }
    setLoading(false);
  };


  return (
    <>
      <Message open={mensajeLogin} onClose={cerrarMensaje}
        severity='warning'>
        {loginError}
      </Message>
      <div className='fondoLogin'>
        <div className='loginDatos'>
          <div className='login-seccion-izquierda'>
            <img src={dollarImg} loading="lazy"
              alt='Ilustración de dolar'
              className='rotating-image'/>
            <h1>{t('pg_login_title')}</h1>
          </div>
          <div ref={loginRef} className='card'>
            <h1>{t('pg_login_welcome')}</h1>
            <form onSubmit={submitForm}>
              <div className="card-content">
                <p>{t('pg_lgn_inputUserPass')}</p>

                <InputText
                  style={STYLES.input}
                  label={t('pg_lgn_placeholderUsername')}
                  value={credenciales.username}
                  onChange={ (e) => setCredenciales({...credenciales, username : e.target.value})}
                  error={errorUsername}
                  setError={setErrorUsername}/>

                <PasswordInputWithToggle 
                  label={t('pg_lgn_placeholderPass')}
                  value={credenciales.password}
                  onChange={(e) => setCredenciales({...credenciales, password : e.target.value})}
                  error={errorPassword}
                  setError={setErrorPassword}/>

                <Button 
                  type='submit'
                  className='btnLogin' variant="contained">{t('pg_lgn_valueBtnLgn')}</Button>

                <LoadingBlocker open={loading} parentRef={loginRef}/>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;