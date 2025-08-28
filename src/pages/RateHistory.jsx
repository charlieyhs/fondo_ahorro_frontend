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
import { Add, Close, Delete, Edit, Save } from "@mui/icons-material";
import DatePicker from "../components/Inputs/DatePicker";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import { formatDate, formatDatetime } from "../utils/DateUtil";
import InputNumber from "../components/Inputs/InputNumber";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";

const RateHistory = () => {
    const {t} = useTranslation();

    const dialogRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const [severityMessage, setSeverityMessage] = useState('success');
    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);

    const [errors, setErrors] = useState([]);

    const [ratesHistory, setRatesHistory] = useState([]);
    const [openDlg, setOpenDlg] = useState(false);
    const [newRate, setNewRate] = useState({
        name: '',
        rateType: '',
        rate : 0,
        startDate : null,
        endDate : null,
    });

    const [rateTypes, setRateTypes] = useState([]);

    const getRateHistory = async() => {
        try{
            const res = await apiClient.get('ratehistory');
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
                const res = await apiClient.get('ratehistory/ratetypes');
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
    const handleOpenDialogEdit = (row) => {
        setNewRate({
            id: row.id,
            name: row.name,
            rateType: row.rateType,
            rate : row.rate,
            startDate : new Date(row.startDate),
            endDate : row.endDate ? new Date(row.endDate) : null,
        });
        handleOpenDialog();
    };

    const handleOpenDialog = () => {
        setErrors([]);
        setOpenDlg(true);
    }
    const handleCloseDialog = () => {
        setOpenDlg(false);
        setNewRate({
            name: '',
            rateType: '',
            rate : 0,
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

    const handleDateChange = (newValue, name) => {
        setNewRate({
            ...newRate,
            [name]: newValue,
        });
    };

    const deleteRecord = async(id) => {
        try{
            const res = await apiClient.delete(`ratehistory/${id}`);
            
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getRateHistory();
            }

        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_deleterate'));
            }
        }
    };

    const handleSaveInterestRate = async() => {
        try{
            setLoading(true);
            
            const requiredFields = ['name','rateType', 'rate', 'startDate'];

            const missingFields = requiredFields.filter(field => {
                const value = newRate[field];
                return !value;
            });

            if(missingFields.length > 0){
                setErrors(missingFields);
                setSeverityMessage('warning');
                setMessage(t('eti_fields_required'));
                return;
            }
            setErrors([]);
            let res = null;
            if(!newRate.id){
                res = await apiClient.post('ratehistory', newRate);
            }else{
                res = await apiClient.patch(`ratehistory/${newRate.id}`, newRate);
            }

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
                setMessage(t('eti_error_addrecord'));
            }
        }finally{
            setLoading(false);
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
                        id="btnOpenDlg"
                        title={t('eti_new')}
                        >
                        {t('eti_new')}
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_name')}</TableCell>
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
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{t('eti_ratetype_'+row.rateType)}</TableCell>
                                        <TableCell>{row.rate}</TableCell>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{formatDate(row.endDate) || '-'}</TableCell>
                                        <TableCell>{row.registeredBy}</TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>
                                            <div style={{display:'flex'}}>
                                                <IconButton
                                                    className="buttonRound btnEdit"
                                                    title={t('eti_edit')}
                                                    onClick={() => handleOpenDialogEdit(row)}>
                                                    <Edit/>
                                                </IconButton>

                                                <ConfirmDialog
                                                    textQuestion={t('eti_delete_record')}
                                                    onConfirm={() => deleteRecord(row.id)}>
                                                    <IconButton style={{marginLeft: '5px'}}
                                                        className="button btnDelete"
                                                        title={t('eti_delete')}>
                                                        <Delete/>
                                                    </IconButton>
                                                </ConfirmDialog>
                                            </div>
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
                disableRestoreFocus
            >
                <div ref={dialogRef}>
                    <DialogTitle>
                        <Typography variant='h6' component='span'>{t('pag_ratehistory_new')}</Typography>
                        <IconButton
                            aria-label={t('eti_close')}
                            onClick={handleCloseDialog}
                            title={t('eti_close')}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <Close/>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Box component='form' sx={{mt: 1}}>
                            
                            <TextField
                                value={newRate.name}
                                error={errors.includes('name')}
                                helperText={errors.includes('name') ? t('eti_required_field') : ''}
                                required
                                label={t('eti_name')}
                                color="success"
                                fullWidth
                                style={{marginBottom: '15px'}}
                                onChange={(e) => setNewRate(prev => ({...prev, name: e.target.value}) )}
                                slotProps={{
                                    input:{
                                        inputProps:{maxLength: 50}
                                    }
                                }}
                            />

                            <Autocomplete
                                value={newRate?.rateType || null}
                                options={rateTypes}
                                getOptionLabel={(type) => t('eti_ratetype_' + type)}
                                renderInput={(params) => 
                                    <TextField
                                        {...params}
                                        label={t('eti_ratetype')}
                                        error={errors.includes('rateType')}
                                        helperText={errors.includes('rateType') ? t('eti_required_field') : ''}
                                        color='success'
                                        required
                                        />
                                }
                                onChange={(_, newValue) => handleTypeRateChange(newValue)}
                            />
                            
                            <InputNumber
                                value={newRate.rate}
                                onChange={(value) => setNewRate(prev => ({...prev, rate: value}))}
                                min={0}
                                max={100}
                                decimalPlaces={2}
                                label={t('eti_rate')}
                                required
                                error={errors.includes('rate')}
                                helperText={errors.includes('rate') ? t('eti_required_field') : ''}
                                fullWidth
                                margin="normal"
                                color="success" />

                            <DatePicker 
                                label={t('eti_startdate')}
                                value={newRate.startDate}
                                onChange={(newValue) => handleDateChange(newValue, 'startDate')}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal',
                                        required: true,
                                        error: errors.includes('startDate'),
                                        helperText: errors.includes('startDate') ? t('eti_required_field') : '',
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
                            title={newRate.id ? t('eti_update') : t('eti_save')}
                        >
                            {newRate.id ? t('eti_update') : t('eti_save')}
                        </Button>
                    </DialogActions>

                    <LoadingBlocker open={loading} parentRef={dialogRef}/>
                </div>
            </Dialog>

        </div>
    );
}

export default RateHistory;