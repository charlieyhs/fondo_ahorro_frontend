import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel,
  OutlinedInput , InputAdornment, IconButton} from '@mui/material';
import Visibility from '@mui/icons-material/esm/Visibility';
import VisibilityOff from '@mui/icons-material/esm/VisibilityOff';

const PasswordInputWithToggle = ({label}) => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((view) => !view);
  };

  return (
    <FormControl sx={{width: '100%', mt: '10px'}} variant="outlined">
      <InputLabel htmlFor="password-input">{label}</InputLabel>
      <OutlinedInput
        id="password-input"
        type={showPassword ? 'text' : 'password'}
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
    </FormControl>
  );
}

PasswordInputWithToggle.propTypes = {
  label : PropTypes.string.isRequired,
};

export default PasswordInputWithToggle;