import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker as DatePickerMUI} from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';


const DatePicker = ({label, slotProps, value, onChange, maxDate}) => {
    
    const defaultSlotProps = {
        textField: {
            color: 'success',
        },
    };
    
    const {i18n} = useTranslation();
    
    useEffect(() => {
        dayjs.locale(i18n.language);
    },[i18n.language]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
            <DatePickerMUI
                label={label}
                value={value ? dayjs(value) : null}
                onChange={(newValue) => onChange(newValue)}
                slotProps={{
                        ...defaultSlotProps, 
                        ...slotProps,
                        textField: {
                            ...defaultSlotProps.textField,
                            ...slotProps?.textField,
                        },
                    }}
                views={['year', 'month', 'day']}
                maxDate={maxDate}
            />
        </LocalizationProvider>
    );
};

DatePicker.propTypes = {
    label : PropTypes.string.isRequired,
    slotProps : PropTypes.object,
    value : PropTypes.object,
    onChange : PropTypes.func,
    maxDate : PropTypes.object
}

export default DatePicker;