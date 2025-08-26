import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const InputNumber = ({
    value,
    onChange,
    min = 0,
    max = 100,
    decimalPlaces = 2,
    label,
    required = false,
    error = false,
    helperText,
    ...props
}) => {
    const {i18n} = useTranslation();
    const [inputValue, setInputValue] = useState('');

    const [localError, setLocalError] = useState(false);
    const [localHelperText, setLocalHelperText] = useState('');

    const getSeparators = useCallback(() => {
        const numberFormat = new Intl.NumberFormat(i18n.language);
        const parts = numberFormat.formatToParts(12345.5);
        return {
            decimal: parts.find(part => part.type === 'decimal')?.value || '.',
            thousand: parts.find(part => part.type === 'group')?.value || ',',
        };
    }, [i18n]);

    useEffect(() => {
        setLocalError(error);
        setLocalHelperText(helperText || '');
    }, [error, helperText]);

    useEffect(() => {
        if(value === null || value === undefined){
            setInputValue('');
            return;
        }
        const separator = getSeparators();
        const formatted = value
            .toFixed(decimalPlaces)
            .replace('.',separator.decimal);
        
        setInputValue(formatted);

    }, [value, decimalPlaces, getSeparators]);

    const handleChange = (event) => {
        const rawValue = event.target.value;
        const separators = getSeparators();

        const validPattern = new RegExp(
            `^[0-9${separators.thousand}]*${separators.decimal}?[0-9]{0,${decimalPlaces}}$`
        );

        if(!validPattern.test(rawValue) && rawValue !== '') return;

        setInputValue(rawValue);
        setLocalError(false);
        setLocalHelperText('');

        let numericValue = rawValue
            .replace(new RegExp(`\\${separators.thousand}`, 'g'), '')
            .replace(separators.decimal, '.');
        
        let num = parseFloat(numericValue);
        if(isNaN(num)){
            num = 0;
        }
        if(num < min || num > max) return;

        setInputValue(rawValue);

        if(numericValue === ''){
            onChange(null);
        }

    };

    const handleBlur = () => {
        if(inputValue === ''){
            onChange(null);
            return;
        }
        const separators = getSeparators();
        let numericValue = parseFloat(
            inputValue
                .replace(new RegExp(`\\${separators.thousand}`, 'g'), '')
                .replace(separators.decimal, '.')
        );
        if(isNaN(numericValue)){
            setInputValue('');
            onChange(null);
            return;
        }

        numericValue = Math.max(min, Math.min(max, numericValue));
        numericValue = Math.round(numericValue * 10 ** decimalPlaces) / 10 ** decimalPlaces;

        onChange(numericValue);
    };

    const separators = getSeparators();

    return (
        <TextField {...props}
            label={label}
            value={inputValue}
            onChange={handleChange}
            required
            onBlur={handleBlur}
            error={localError}
            helperText={localHelperText}
            slotProps={{htmlInput: {
                            inputMode: 'decimal',
                            pattern: `[0-9${separators.thousand}]*${separators.decimal}?[0-9]{0,${decimalPlaces}}`,
                            min,
                            max,
                            required,
                        }
                    }}
        />
    );
};

InputNumber.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    decimalPlaces: PropTypes.number,
    label: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
};

export default InputNumber;