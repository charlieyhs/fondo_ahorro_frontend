import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback } from "react";


const InputText = ({label, value, onChange, style, error, setError}) => {
    
    const handleChange = useCallback((e) => {
            onChange(e);
            if(error) setError(false);
        },
        [onChange, error, setError]
    );
    
    return (
        <TextField
            sx={style}
            color="success"
            label={label}
            error={error}
            helperText={error ? "Este campo es obligatorio" : ""}
            value={value}
            onFocus={() => error && setError(false)}
            onChange={handleChange}
            />
    );
};

InputText.propTypes = {
    label : PropTypes.string.isRequired,
    value : PropTypes.string.isRequired,
    onChange : PropTypes.func,
    fullWidth : PropTypes.bool,
    error : PropTypes.bool,
    setError : PropTypes.func,
    style : PropTypes.object
};

export default InputText;