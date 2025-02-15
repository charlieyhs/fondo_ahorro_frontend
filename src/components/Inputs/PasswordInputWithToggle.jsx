import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel,
  OutlinedInput , InputAdornment, IconButton,
  FormHelperText} from '@mui/material';
import Visibility from '@mui/icons-material/esm/Visibility';
import VisibilityOff from '@mui/icons-material/esm/VisibilityOff';


const PasswordInputWithToggle = ({label, value, onChange, error, setError}) => {
  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((view) => !view);
  };

  return (
    <FormControl sx={{width: '100%', mt: '10px'}} variant="outlined" color='success'>
      <InputLabel htmlFor='password-input'>{label}</InputLabel>
      <OutlinedInput
        id="password-input"
        type={showPassword ? 'text' : 'password'}
        value={value}
        error={error}
        onFocus={() => error && setError(false)}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
              onClick={togglePasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              edge="end">
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      {error && <FormHelperText error>Este campo es obligatorio</FormHelperText>}
    </FormControl>
  );
}

PasswordInputWithToggle.propTypes = {
  label : PropTypes.string.isRequired,
  value : PropTypes.string.isRequired,
  onChange : PropTypes.func.isRequired,
  error : PropTypes.bool,
  setError : PropTypes.func
};

export default PasswordInputWithToggle;