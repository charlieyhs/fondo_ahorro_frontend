import {Button} from '@mui/material';
import '../css/General.css'
import { BASIC_BTN } from '../css/General';
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
import LanguageSelector from '../components/Lists/LanguageSelector';

const STYLES = {
  input: { width: "100%", my: 1 }
};

const Login = () => {
  
  const {t} = useTranslation();
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
      login(response.token);
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace:true });
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
        <LanguageSelector />
        <div className='login-seccion-izquierda'>
          <img src={dollarImg} loading="lazy"
            alt='Ilustración de dolar'
            className='rotating-image'/>
          <h1>{t('pg_login_title')}</h1>
        </div>
        <div ref={loginRef} className='card'>
          <form onSubmit={submitForm}>
            <h1>{t('pg_login_welcome')}</h1>
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
                sx={BASIC_BTN} variant="contained">{t('pg_lgn_valueBtnLgn')}</Button>

              <LoadingBlocker open={loading} parentRef={loginRef}/>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;