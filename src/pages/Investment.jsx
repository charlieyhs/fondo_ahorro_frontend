import { useEffect, useRef, useState } from "react";
import Message from "../components/Messages/Message";
import Sidebar from "../components/menus/Sidebar";
import { useTranslation } from "react-i18next";
import apiClient from "../clients/apiClient";
import { Autocomplete, Box, 
    Button, 
    Chip, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    IconButton,
    Paper, 
    Stack, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    TextField, 
    Typography } from "@mui/material";
import { Add, Close, Edit, Lock, MoneyOff, PlayArrow, Save } from "@mui/icons-material";
import DatePicker from "../components/Inputs/DatePicker";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import { formatDate, formatDatetime } from "../utils/DateUtil";
import InputNumber from "../components/Inputs/InputNumber";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import { formatNumber } from "../utils/NumbersUtil";
import { GREEN_COLOR, ORANGE_COLOR, RED_DELETE } from "../css/General";
import InvestmentYield from "../components/dialogs/InvestmentYield";

const BASE_URL = "investment";
const STATUS_COLOR = {
    ACTIVE : GREEN_COLOR,
    PENDING : ORANGE_COLOR,
    FINISHED : '#6c757d',
    CANCELLED : RED_DELETE
};

const Investment = () => {
    const {t} = useTranslation();
    const dialogRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [severityMessage, setSeverityMessage] = useState('success');
    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);
    const [errors, setErrors] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [openDlg, setOpenDlg] = useState(false);
    const [moneyLocations, setMoneyLocations] = useState([]);
    const [typesInvestment, setTypesInvestment] = useState([]);
    const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
    const [closeInvestment, setCloseInvestment] = useState(false);

    const emptyCurrentInvestment = () => (
        {
            name : '',
            moneyLocation : null,
            amount : 0,
            startDate : null,
            interestRate : null,
            status : null,
            description : '',
            type : null,
        }

    );

    const [currentInvestment, setCurrentInvestment] = useState(emptyCurrentInvestment());


    const getInvestments = async() => {
        try{
            const res = await apiClient.get(BASE_URL);
            if(res.data){
                setInvestments(res.data);
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining investments');
            }
        }
    };

    const getTypesInvestments = async() => {
        try{
            const res = await apiClient.get(`${BASE_URL}/types`);
            if(res.data){
                setTypesInvestment(res.data);
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining types of investments');
            }
        }
    };
    
    
    useEffect(() => {
        getInvestments();
        getTypesInvestments();
    }, []);

    const handleOpenDialogEdit = (row) => {
        setCurrentInvestment({
            id: row.id,
            name: row.name,
            moneyLocation : row.moneyLocation,
            amount : row.amount,
            startDate : new Date(row.startDate),
            interestRate : row.interestRate,
            description : row.description,
            code : row.code,
            type : row.type
        });
        handleOpenDialog();
    };

    const handleOpenDialog = () => {
        setErrors([]);
        setOpenDlg(true);
    }
    const handleCloseDialog = () => {
        setOpenDlg(false);
        setCurrentInvestment(emptyCurrentInvestment());
    };

    const handleValueChange = (value, field ) => {
        setCurrentInvestment({
            ...currentInvestment,
            [field]: value,
        });
    };

    const handleActionInvestment = async(action, id) => {
        try{
            const res = await apiClient.patch(`${BASE_URL}/${id}/${action}`);
            
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getInvestments();
            }

        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_action'));
            }
        }
    };

    const handleSaveRecord = async() => {
        try{
            setLoading(true);
            const requiredFields = ['moneyLocation','amount', 'startDate', 'type'
                                    ,'interestRate','description'];

            const missingFields = requiredFields.filter(field => {
                const value = currentInvestment[field];
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
            if(!currentInvestment.id){
                res = await apiClient.post(BASE_URL, currentInvestment);
            }else{
                res = await apiClient.patch(`${BASE_URL}/${currentInvestment.id}`, currentInvestment);
            }

            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getInvestments();
                handleCloseDialog();
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else if(currentInvestment.id){
                setMessage(t('eti_error_updatedrecord'));
            }else{
                setMessage(t('eti_error_addrecord'));
            }
        }finally{
            setLoading(false);
        }
    };

    const handleInputChangeAutocomplete = async(query, autocomplete) => {
        try{
            setLoadingAutocomplete(true);
            let endpoint = null;
            const config = {
                params: {
                    query : query,
                }
            }

            if(autocomplete === 'moneylocations'){
                endpoint = 'money-location/autocomplete';
            }

            const res = await apiClient.get(endpoint, config);

            if(res.data && autocomplete === 'moneylocations'){
                setMoneyLocations(res.data)
            }
            
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_obtainingdata'));
            }
        }finally {
            setLoadingAutocomplete(false);
        }
    };

    const openCloseInvestment = (row) => {
        setCurrentInvestment(row);
        setCloseInvestment(true);
    };

    const closeDlgInvestment = () => {
        setCurrentInvestment(emptyCurrentInvestment());
        setCloseInvestment(true);
        getInvestments();
    };

    return (
        <div className='divPag'>
            <Message severity={severityMessage}
                open={!!message}
                onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar />
            <div className="divRight">
                <div className="divTitleBtnNew">
                    <h1 style={{marginTop: '0px'}}>{t('pag_investment_title')}</h1>
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
                                <TableCell>{t('eti_code')}</TableCell>
                                <TableCell>{t('eti_state')}</TableCell>
                                <TableCell>{t('eti_name')}</TableCell>
                                <TableCell>{t('eti_moneylocation')}</TableCell>
                                <TableCell>{t('eti_amount')}</TableCell>
                                <TableCell>{t('eti_yield')}</TableCell>
                                <TableCell>{t('eti_rate')}</TableCell>
                                <TableCell>{t('eti_startdate')}</TableCell>
                                <TableCell>{t('eti_duedate')}</TableCell>
                                <TableCell>{t('eti_description')}</TableCell>
                                <TableCell>{t('eti_registeredby')}</TableCell>
                                <TableCell>{t('eti_updatedat')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                investments.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={t('eti_state_' + row.status)}
                                                variant="filled"
                                                style={{
                                                    color:'#fff',
                                                    backgroundColor: STATUS_COLOR[row.status]
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.moneyLocation.name}</TableCell>
                                        <TableCell>{formatNumber(row.amount)}</TableCell>
                                        <TableCell>{row.totalPerformance ? formatNumber(row.totalPerformance) : '-'}</TableCell>
                                        <TableCell>{formatNumber(row.interestRate)}</TableCell>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{row.dueDate ? formatDate(row.dueDate) : '-'}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{row.createdBy.firstName + ' ' + row.createdBy.lastName}</TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>
                                            {
                                                row.status === 'PENDING' && (
                                                    <div style={{display:'flex', gap:'5px' }}>
                                                        <IconButton
                                                            className="btnEdit"
                                                            title={t('eti_edit')}
                                                            onClick={() => handleOpenDialogEdit(row)}>
                                                            <Edit/>
                                                        </IconButton>
                                                        
                                                        <ConfirmDialog
                                                            textQuestion={t('eti_start_investment')}
                                                            onConfirm={() => handleActionInvestment('start',row.id)}
                                                        >
                                                            <IconButton
                                                                className="btnSave"
                                                                title={t('btn_start_investment')}
                                                            >
                                                            <PlayArrow />
                                                            </IconButton>
                                                        </ConfirmDialog>

                                                        <ConfirmDialog
                                                            textQuestion={t('eti_cancel_investment')}
                                                            onConfirm={() => handleActionInvestment('cancel',row.id)}
                                                        >
                                                            <IconButton
                                                                className="btnDelete"
                                                                title={t('btn_cancel_investment')}
                                                            >
                                                            <MoneyOff />
                                                            </IconButton>
                                                        </ConfirmDialog>
                                                    </div>
                                                )
                                            }
                                            {row.status === 'ACTIVE' && (
                                                <IconButton
                                                    className="btnSave"
                                                    title={t('eti_close_investment')}
                                                    onClick={() => openCloseInvestment(row)}>
                                                    <Lock/>
                                                </IconButton>
                                            )}
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
                        <Typography variant='h6' component='span'>{currentInvestment.id ? t('eti_update_record') : t('pag_ratehistory_new')}</Typography>
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
                            <Stack spacing={2}>
                                <TextField
                                    value={currentInvestment.name}
                                    error={errors.includes('name')}
                                    helperText={errors.includes('name') ? t('eti_required_field') : ''}
                                    required
                                    label={t('eti_name')}
                                    color="success"
                                    fullWidth
                                    onChange={(e) => handleValueChange(e.target.value, 'name') }
                                    slotProps={{
                                        input:{
                                            inputProps:{maxLength: 50}
                                        }
                                    }}
                                />
                                <Autocomplete
                                    value={currentInvestment.type || null}
                                    options={typesInvestment}
                                    getOptionLabel={(type) => t('eti_type-investment_'+type)}
                                    renderInput={(params) => 
                                        <TextField
                                            {...params}
                                            label={t('eti_type_investment')}
                                            error={errors.includes('type')}
                                            helperText={errors.includes('type') ? t('eti_required_field') : ''}
                                            color="success"
                                            required />
                                    }
                                    required
                                    onChange={(_, value) => handleValueChange(value, 'type')}
                                />
                                <Autocomplete
                                    options={moneyLocations}
                                    value={currentInvestment.moneyLocation || null}
                                    required
                                    onChange={(_, value) => handleValueChange(value, 'moneyLocation')}
                                    getOptionLabel={(moneyLocation) => moneyLocation.name}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onInputChange={(_, query) => handleInputChangeAutocomplete(query,'moneylocations')}
                                    renderInput={(params) => 
                                        <TextField
                                            {...params}
                                            label={t('eti_moneylocation')}
                                            error={errors.includes('moneyLocation')}
                                            helperText={errors.includes('moneyLocation') ? t('eti_required_field') : ''}
                                            color='succces'
                                            fullWidth
                                            required
                                        />
                                    }
                                    onOpen={() => handleInputChangeAutocomplete('','moneylocations')}
                                    loading={loadingAutocomplete}
                                />
                                
                                <InputNumber
                                    value={currentInvestment.amount}
                                    onChange={(value) => handleValueChange(value, 'amount') }
                                    min={0}
                                    decimalPlaces={2}
                                    label={t('eti_amount')}
                                    required
                                    error={errors.includes('amount')}
                                    helperText={errors.includes('amount') ? t('eti_required_field') : ''}
                                    fullWidth
                                    margin="normal"
                                    color="success" />

                                <InputNumber
                                    value={currentInvestment.interestRate}
                                    onChange={(value) => handleValueChange(value, 'interestRate') }
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
                                    value={currentInvestment.startDate}
                                    onChange={(newValue) => handleValueChange(newValue, 'startDate')}
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

                                <TextField
                                    value={currentInvestment.description}
                                    required
                                    label={t('eti_description')}
                                    color="success"
                                    fullWidth
                                    multiline
                                    style={{marginTop: '10px'}}
                                    rows={4}
                                    onChange={(e) => handleValueChange(e.target.value, 'description')}
                                    slotProps={{
                                        input:{
                                            inputProps:{maxLength: 200}
                                        }
                                    }}
                                />
                            </Stack>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button 
                            className='btnSave'
                            onClick={handleSaveRecord}
                            startIcon={<Save />}
                            variant='contained'
                            title={currentInvestment.id ? t('eti_update') : t('eti_save')}
                        >
                            {currentInvestment.id ? t('eti_update') : t('eti_save')}
                        </Button>
                    </DialogActions>

                    <LoadingBlocker open={loading} parentRef={dialogRef}/>
                </div>
            </Dialog>
            {currentInvestment.id && (
                <InvestmentYield
                    isOpen={closeInvestment}
                    onClose={() => closeDlgInvestment()}
                    investment={currentInvestment}
                />
            )}
        </div>
    );
}

export default Investment;