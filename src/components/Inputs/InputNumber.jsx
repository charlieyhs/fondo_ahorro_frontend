import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";

const InputNumber = ({
    value,
    onChange,
    min = 0,
    max = Infinity,
    decimalPlaces = 2,
    label,
    required = false,
    error = false,
    helperText,
    ...props
}) => {
    const { i18n } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [localError, setLocalError] = useState(false);
    const [localHelperText, setLocalHelperText] = useState('');
    const inputRef = useRef(null);
    const nextSelection = useRef(null);
    const isEditing = useRef(false);

    const getSeparators = useCallback(() => {
        const numberFormat = new Intl.NumberFormat(i18n.language);
        const parts = numberFormat.formatToParts(12345.5);
        return {
            decimal: parts.find(part => part.type === 'decimal')?.value || '.',
            thousand: parts.find(part => part.type === 'group')?.value || ',',
        };
    }, [i18n]);

    // Función para formatear solo la parte entera con separadores de miles
    const formatIntegerPart = useCallback((num) => {
        if (num === null || num === undefined || isNaN(num)) return '';
        
        // Formatear solo la parte entera
        const integerPart = Math.floor(Math.abs(num));
        const formatter = new Intl.NumberFormat(i18n.language, {
            useGrouping: true,
            maximumFractionDigits: 0
        });
        
        return formatter.format(integerPart);
    }, [i18n.language]);

    // Función para formatear el número completo con decimales
    const formatNumberWithDecimals = useCallback((num) => {
        if (num === null || num === undefined || isNaN(num)) return '';
        
        const formatter = new Intl.NumberFormat(i18n.language, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
            useGrouping: true
        });
        
        return formatter.format(num);
    }, [i18n.language, decimalPlaces]);

    const parseInputValue = useCallback((inputStr, separators) => {
        if (!inputStr || inputStr === '') return null;
        
        const cleanValue = inputStr
            .replace(new RegExp(`\\${separators.thousand}`, 'g'), '')
            .replace(separators.decimal, '.');
        
        const num = parseFloat(cleanValue);
        return isNaN(num) ? null : num;
    }, []);

    // Efecto para mantener la posición del cursor
    useLayoutEffect(() => {
        if (inputRef.current && nextSelection.current !== null) {
            const inputElement = inputRef.current.querySelector('input');
            if (inputElement?.setSelectionRange) {
                inputElement.setSelectionRange(
                    nextSelection.current.start,
                    nextSelection.current.end
                );
            }
            nextSelection.current = null;
        }
    });

    useEffect(() => {
        setLocalError(error);
        setLocalHelperText(helperText || '');
    }, [error, helperText]);

    useEffect(() => {
        if (!isEditing.current) {
            if (value === null || value === undefined) {
                setInputValue('');
            } else {
                const formatted = formatNumberWithDecimals(value);
                setInputValue(formatted);
            }
        }
    }, [value, formatNumberWithDecimals]);

    const handleChange = (event) => {
        isEditing.current = true;
        const rawValue = event.target.value;
        const cursorPosition = event.target.selectionStart;
        const separators = getSeparators();

        // Permitir solo números y separadores
        const allowedChars = new RegExp(`^[0-9\\${separators.thousand}\\${separators.decimal}]*$`);
        if (!allowedChars.test(rawValue) && rawValue !== '') return;

        // Validaciones de decimal
        const decimalCount = (rawValue.match(new RegExp(`\\${separators.decimal}`, 'g')) || []).length;
        if (decimalCount > 1) return;

        const decimalIndex = rawValue.indexOf(separators.decimal);
        if (decimalIndex !== -1) {
            const decimals = rawValue.substring(decimalIndex + 1);
            if (decimals.length > decimalPlaces) return;
        }

        // Parsear y validar rango
        const numericValue = parseInputValue(rawValue, separators);
        if (numericValue !== null && (numericValue < min || numericValue > max)) return;

        // Manejar campo vacío
        if (rawValue === '') {
            setInputValue('');
            setLocalError(false);
            setLocalHelperText('');
            onChange(null);
            return;
        }

        // Formatear el valor en tiempo real - solo parte entera mientras se edita
        let formattedValue = rawValue;
        if (numericValue !== null) {
            // Si hay un separador decimal, formatear la parte entera y mantener los decimales tal cual
            if (decimalIndex !== -1) {
                const integerPart = Math.floor(numericValue);
                const decimalPart = rawValue.substring(decimalIndex + 1);
                
                const formattedInteger = formatIntegerPart(integerPart);
                formattedValue = formattedInteger + separators.decimal + decimalPart;
            } else {
                // Si no hay separador decimal, formatear solo la parte entera
                formattedValue = formatIntegerPart(numericValue);
            }
        }

        setInputValue(formattedValue);
        setLocalError(false);
        setLocalHelperText('');

        if (numericValue !== null) {
            onChange(numericValue);
        }

        // Calcular nueva posiciÃ³n del cursor
        const newCursorPosition = cursorPosition + (formattedValue.length - rawValue.length);
        nextSelection.current = { 
            start: Math.max(0, newCursorPosition), 
            end: Math.max(0, newCursorPosition) 
        };
    };

    const handleBlur = () => {
        isEditing.current = false;
        if (inputValue === '') {
            onChange(null);
            return;
        }

        const separators = getSeparators();
        const numericValue = parseInputValue(inputValue, separators);
        
        if (numericValue === null) {
            setInputValue('');
            onChange(null);
            return;
        }
        
        // Aplicar límites y redondeo
        const clampedValue = Math.max(min, Math.min(max, numericValue));
        const roundedValue = Number(clampedValue.toFixed(decimalPlaces));
        
        // Formatear valor final con decimales
        const finalFormatted = formatNumberWithDecimals(roundedValue);
        setInputValue(finalFormatted);
        onChange(roundedValue);
    };

    

    const separators = getSeparators();

    return (
        <TextField
            {...props}
            ref={inputRef}
            label={label}
            value={inputValue}
            onChange={handleChange}
            required={required}
            onBlur={handleBlur}
            error={localError}
            helperText={localHelperText}
            slotProps={{
                htmlInput: {
                    inputMode: 'decimal',
                    pattern: `[0-9\\${separators.thousand}\\${separators.decimal}]*`,
                    min,
                    max,
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