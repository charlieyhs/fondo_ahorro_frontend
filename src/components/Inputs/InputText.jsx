import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const InputText = ({label, value, onChange, style, error, setError, slotProps}) => {
    
    const {t} = useTranslation();

    const handleChange = useCallback((e) => {
            onChange(e);
            if(error) setError(false);
        },[onChange, error, setError]
    );
    
    return (
        <TextField
            color='success'
            sx={style}
            label={label}
            error={error}
            helperText={error ? t('eti_required_field') : ""}
            value={value}
            onFocus={() => error && setError(false)}
            onChange={handleChange}
            slotProps={slotProps}
        />
    );
};

InputText.propTypes = {
    label : PropTypes.string.isRequired,
    value : PropTypes.string.isRequired,
    onChange : PropTypes.func,
    error : PropTypes.bool,
    setError : PropTypes.func,
    style : PropTypes.object,
    slotProps: PropTypes.object,
};

export default InputText;