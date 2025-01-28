import { useState } from 'react'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/esm/Visibility';
import VisibilityOff from '@mui/icons-material/esm/VisibilityOff';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';

function PasswordInputWithToggle() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{width: '100%', mt: '10px'}} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Ocultar la contraseña' : 'Mostrar la contraseña'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

export default PasswordInputWithToggle;