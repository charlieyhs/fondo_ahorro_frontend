import { useEffect, useRef, useState } from "react";
import Message from "../components/Messages/Message";
import Sidebar from "../components/menus/Sidebar";
import { useTranslation } from "react-i18next";
import apiClient from "../clients/apiClient";
import { Autocomplete, Box, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    IconButton,
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField, 
    Typography } from "@mui/material";
import { Add, Close, Edit, Save } from "@mui/icons-material";
import DatePicker from "../components/Inputs/DatePicker";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import { formatDate, formatDatetime } from "../utils/DateUtil";

const RateHistory = () => {
    const {t} = useTranslation();

    const dialogRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [submittedNewRate, setSubmittedNewRate] = useState(false);

    const [severityMessage, setSeverityMessage] = useState('success');
    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);


    const [ratesHistory, setRatesHistory] = useState([]);
    const [openDlg, setOpenDlg] = useState(false);
    const [newRate, setNewRate] = useState({
        rateType: '',
        rate : '',
        startDate : null,
        endDate : null,
    });

    const [rateTypes, setRateTypes] = useState([]);

    const getRateHistory = async() => {
        try{
            const res = await apiClient.get('savingsfund/ratehistory');
            if(res.data){
                setRatesHistory(res.data);
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining rates history');
            }
        }
    };
    
    useEffect(() => {
        const getRateTypes = async () => {
            try{
                const res = await apiClient.get('savingsfund/ratetypes');
                if(res.data){
                    setRateTypes(res.data);
                }
            }catch(e){
                setSeverityMessage('warning');
                if(e.response){
                    setMessage(e.response.data.message);
                }else{
                    setMessage('Error obtaining rates history');
                }
            }
        };
        getRateTypes();
        getRateHistory();
    }, []);

    const handleOpenDialog = () => setOpenDlg(true);
    const handleCloseDialog = () => {
        setOpenDlg(false);
        setSubmittedNewRate(false);
        setNewRate({
            rateType: '',
            rate : '',
            startDate : null,
            endDate : null,
        });
    };

    const handleTypeRateChange = (newValue) => {
        
        setNewRate({
            ...newRate,
            rateType: newValue,
        });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewRate({
            ...newRate,
            [name] : value,
        });
    };

    const handleDateChange = (newValue, name) => {
        setNewRate({
            ...newRate,
            [name]: newValue,
        });
    };



    const handleSaveInterestRate = async() => {
        try{
            setLoading(true);
            setSubmittedNewRate(true);
            if(!newRate.rateType || !newRate.rate || !newRate.startDate){
                setSeverityMessage('warning');
                setMessage(t('eti_fields_required'))
                return;
            }
            const res = await apiClient.post('savingsfund/ratehistory', newRate);

            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getRateHistory();
                handleCloseDialog();
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_addrate'));
            }
        }finally{
            setLoading(false);
            setSubmittedNewRate(false);
        }
    };

    return (
        <div className='divPag'>
            <Message severity={severityMessage}
                open={!!message}
                onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                margin: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1 style={{marginTop: '0px'}}>{t('pag_ratehistory_title')}</h1>
                    <Button  type='button' 
                        className='button' 
                        variant='contained'
                        startIcon={<Add />}
                        onClick={handleOpenDialog}
                        >
                        {t('eti_nuevo')}
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_ratetype')}</TableCell>
                                <TableCell>{t('eti_rate')}</TableCell>
                                <TableCell>{t('eti_startdate')}</TableCell>
                                <TableCell>{t('eti_enddate')}</TableCell>
                                <TableCell>{t('eti_registeredby')}</TableCell>
                                <TableCell>{t('eti_updatedat')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                ratesHistory.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{t('eti_ratetype_'+row.rateType)}</TableCell>
                                        <TableCell>{row.rate}</TableCell>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{formatDate(row.endDate) || '-'}</TableCell>
                                        <TableCell>{row.registeredBy}</TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                className="buttonRound"
                                                onClick={handleOpenDialog}>
                                                    <Edit/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog
                open={openDlg}
                onClose={handleCloseDialog}
                maxWidth='sm'
                fullWidth
            >
                <div ref={dialogRef}>
                    <DialogTitle>
                        <Typography variant='h6' component='span'>{t('pag_ratehistory_new')}</Typography>
                        <IconButton
                            aria-label='close'
                            onClick={handleCloseDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close/>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Box component='form' sx={{mt: 1}}>

                            <Autocomplete
                                options={rateTypes}
                                getOptionLabel={(type) => t('eti_ratetype_' + type)}
                                renderInput={(params) => 
                                    <TextField
                                        {...params}
                                        label={t('eti_ratetype')}
                                        error={submittedNewRate && !newRate.rateType} 
                                        helperText={submittedNewRate && !newRate.rateType ? t('eti_required_field') : ''}
                                        color='success'
                                        required/>
                                }
                                onChange={(_, newValue) => handleTypeRateChange(newValue)}
                            />
                            
                            <TextField
                                color='success'
                                fullWidth
                                margin='normal'
                                label={t('eti_rate')}
                                name='rate'
                                type='number'
                                value={newRate.rate}
                                onChange={handleInputChange}
                                required
                                slotProps={{
                                    htmlInput: {step: '0.01', min:'0'}
                                }}
                                error={submittedNewRate && !newRate.rate} 
                                helperText={submittedNewRate && !newRate.rate ? t('eti_required_field') : ''}
                            />


                            <DatePicker 
                                label={t('eti_startdate')}
                                value={newRate.startDate}
                                onChange={(newValue) => handleDateChange(newValue, 'startDate')}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                        required: true,
                                        error: submittedNewRate && !newRate.startDate, 
                                        helperText: submittedNewRate && !newRate.startDate ? t('eti_required_field') : '',
                                    }
                                }}
                            />

                            <DatePicker 
                                label={t('eti_enddate')}
                                value={newRate.endDate}
                                onChange={(newValue) => handleDateChange(newValue, 'endDate')}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                    }
                                }}
                            />
                            
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button 
                            className='btnSave'
                            onClick={handleSaveInterestRate}
                            startIcon={<Save />}
                            variant='contained'
                        >
                            {t('eti_save')}
                        </Button>
                    </DialogActions>

                    <LoadingBlocker open={loading} parentRef={dialogRef}/>
                </div>
            </Dialog>

        </div>
    );
}

export default RateHistory;