import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/menus/Sidebar";
import Message from "../components/Messages/Message";
import { Autocomplete, Box, Button, 
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
import { useTranslation } from "react-i18next";
import apiClient from "../clients/apiClient";
import { Add, Bolt, Close, Edit, MoneyOff, Payments, Save } from "@mui/icons-material";
import { dateWithoutTimezone, formatDate, formatDatetime } from "../utils/DateUtil";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import DatePicker from "../components/Inputs/DatePicker";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import { formatNumber } from "../utils/NumbersUtil";
import InputNumber from "../components/Inputs/InputNumber";
import { BLUE_COLOR, GREEN_COLOR, ORANGE_COLOR, RED_DELETE } from "../css/General";

const BASE_URL = 'loan';
const STATUS_COLOR = {
    ACTIVE : GREEN_COLOR,
    CANCELLED : RED_DELETE,
    CLOSED : BLUE_COLOR,
    CONSTRUCTION : ORANGE_COLOR,
};

const Loan = () => {
    const {t} = useTranslation();
    const dialogRef = useRef();
    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);
    const [dialog, setDialog] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
    const [severityMessage, setSeverityMessage] = useState('warning');

    const [loans, setLoans] = useState([]);
    const [members, setMembers] = useState([]);
    const [moneyLocations, setMoneyLocations] = useState([]);

    const getLoans = async() => {
        try{
            const res = await apiClient.get(BASE_URL);
            if(res.data){
                setLoans(res.data);
            }
        }catch(e){
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining loans');
            }
        }
    };

    useEffect(() => {
        getLoans();
    },[]);

    const emptyLoan = () => {
        return {
            id : null,
            member : '',
            startDate : null,
            moneyLocation : null,
            amount : null,
            interestRate: null,
            status: null,
            updatedAt : null,
        }
    };

    const [currentLoan, setCurrentLoan] = useState(emptyLoan());

    const handleOpenDialog = () => {
        setDialog(true);
        setErrors([]);
    };

    const handleCloseDialog = () => {
        setCurrentLoan(emptyLoan());
        setDialog(false);
    };

    const handleValueChange = (value, field ) => {
        setCurrentLoan({
            ...currentLoan,
            [field]: value,
        });
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

            if(autocomplete === 'members'){
                endpoint = 'members/autocomplete';
            }else if(autocomplete === 'moneylocations'){
                endpoint = 'money-location/autocomplete';
            }

            const res = await apiClient.get(endpoint, config);

            if(res.data && autocomplete === 'members'){
                setMembers(res.data);
            }else if(res.data && autocomplete === 'moneylocations'){
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
    const handleSaveLoan = async() =>{
        try{
            setLoading(true);

            const requiredFields = ['member', 'startDate','moneyLocation','amount','interestRate'];

            const missingFields = requiredFields.filter(field => !currentLoan[field]);

            if(missingFields.length > 0){
                setSeverityMessage('warning');
                setMessage(t('eti_fields_required'));
                setErrors(missingFields);
                return;
            }
            setErrors([]);

            let res = null;
            if(currentLoan.id){
                res = await apiClient.patch(`${BASE_URL}/${currentLoan.id}`,currentLoan);
            }else{
                res = await apiClient.post(BASE_URL, currentLoan);
            }

            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getLoans();
                handleCloseDialog();
            }

        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else if(currentLoan.id){
                setMessage(t('eti_error_updatedrecord'));
            }else{
                setMessage(t('eti_error_addrecord'));
            }
        }finally{
            setLoading(false);
        }
    };

    const handleOpenEditDialog = (row) => {
        setCurrentLoan({
            id : row.id,
            member : row.member,
            startDate : dateWithoutTimezone(row.startDate),
            moneyLocation : row.moneyLocation,
            amount : row.amount,
            interestRate: row.interestRate,
            status: row.status,
            updatedAt : new Date(row.updatedAt),
            code : row.code
        });
        handleOpenDialog();
    };

    const handleActionLoan = async(action, id) => {
        try{
            const res = await apiClient.patch(`${BASE_URL}/${id}/${action}`);
            
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getLoans();
            }

        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_action'));
            }
        }
    }

    return (
        <div className='divPag'>
            <Message severity={severityMessage} open={!!message} onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar/>
            <div className="divRight">
                <div className="divTitleBtnNew">
                    <h1 style={{marginTop: '0px'}}>{t('pag_loans_title')}</h1>
                    <Button type="button"
                        className="button"
                        variant="contained"
                        startIcon={<Add/>}
                        onClick={handleOpenDialog}
                        title={t('eti_new')}
                    >
                        {t('eti_new')}
                    </Button>
                </div>


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_startdate')}</TableCell>
                                <TableCell>{t('eti_code')}</TableCell>
                                <TableCell>{t('eti_member')}</TableCell>
                                <TableCell>{t('eti_state')}</TableCell>
                                <TableCell>{t('eti_moneylocation')}</TableCell>
                                <TableCell>{t('eti_amount')}</TableCell>
                                <TableCell>{t('eti_currentbalance')}</TableCell>
                                <TableCell>{t('eti_interestrate')}</TableCell>
                                <TableCell>{t('eti_registeredby')}</TableCell>
                                <TableCell>{t('eti_updatedby')}</TableCell>
                                <TableCell>{t('eti_updatedat')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                loans.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>{row.member.firstName + ' ' + row.member.lastName}</TableCell>
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
                                        <TableCell>{row.moneyLocation.name}</TableCell>
                                        <TableCell>{formatNumber(row.amount)}</TableCell>
                                        <TableCell>{formatNumber(row.currentBalance)}</TableCell>
                                        <TableCell>{row.interestRate}</TableCell>
                                        <TableCell>{row.createdBy.firstName + ' ' + row.createdBy.lastName}</TableCell>
                                        <TableCell>{row.updatedBy.firstName + ' ' + row.updatedBy.lastName}</TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>
                                            <div style={{display:'flex'}}>
                                                {row.status === 'CONSTRUCTION' && (
                                                    <>
                                                        <IconButton
                                                            className="btnEdit"
                                                            title={t('eti_edit')}
                                                            onClick={() => handleOpenEditDialog(row)}>
                                                            <Edit/>
                                                        </IconButton>
                                                        <ConfirmDialog
                                                            textQuestion={t('eti_start_loan')}
                                                            onConfirm={() => handleActionLoan('start',row.id)}
                                                        >
                                                            <IconButton
                                                                style={{ marginLeft: '5px' }}
                                                                className="btnSave"
                                                                title={t('btn_start_loan')}
                                                            >
                                                            <Bolt />
                                                            </IconButton>
                                                        </ConfirmDialog>

                                                        <ConfirmDialog
                                                            textQuestion={t('eti_cancel_loan')}
                                                            onConfirm={() => handleActionLoan('cancel',row.id)}
                                                        >
                                                            <IconButton
                                                                style={{ marginLeft: '5px' }}
                                                                className="btnDelete"
                                                                title={t('btn_cancel_loan')}
                                                            >
                                                            <MoneyOff />
                                                            </IconButton>
                                                        </ConfirmDialog>
                                                    </>
                                                )}

                                                {row.status === 'ACTIVE' && (
                                                    <IconButton
                                                        className="btnSave"
                                                        style={{ marginLeft: '5px' }}
                                                        title={t('eti_edit')}
                                                        onClick={() => handleOpenEditDialog(row)}>
                                                        <Payments />
                                                    </IconButton>
                                                )}
                                                
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Dialog open={dialog}
                    onClose={handleCloseDialog}
                    maxWidth='sm'
                    fullWidth
                    disableRestoreFocus>
                    <div ref={dialogRef}>
                        <DialogTitle>
                            <Typography variant="h6" component="span">{currentLoan.id 
                                        ? t('eti_update_record') + ' - ' + currentLoan.code
                                        : t('pag_loan_new')}</Typography>
                            <IconButton
                                aria-label={t('eti_close')}
                                onClick={handleCloseDialog}
                                title={t('eti_close')}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                }}>
                                    <Close/>
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Box component="form" sx={{mt: 1}}>
                                <Stack spacing={2}>
                                    
                                    <DatePicker 
                                        label={t('eti_startdate')}
                                        value={currentLoan.startDate}
                                        onChange={(newValue) => handleValueChange(newValue, 'startDate') }
                                        slotProps={{
                                            textField: {
                                                required: true,
                                                error: errors.includes('startDate'),
                                                helperText: errors.includes('startDate') ? t('eti_required_field') : '',
                                                color: 'success',
                                                fullWidth: true
                                            }
                                        }}
                                    />

                                    <Autocomplete
                                        options={members}
                                        value={currentLoan.member || null}
                                        required
                                        onChange={(_, value) => handleValueChange(value, 'member')}
                                        getOptionLabel={(member) => member.firstName + ' ' + member.lastName}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(_, query) => handleInputChangeAutocomplete(query,'members')}
                                        renderInput={(params) => 
                                            <TextField
                                                {...params}
                                                label={t('eti_member')}
                                                error={errors.includes('member')}
                                                helperText={errors.includes('member') ? t('eti_required_field') : ''}
                                                color='succces'
                                                fullWidth
                                                required
                                            />
                                        }
                                        onOpen={() => handleInputChangeAutocomplete('','members')}
                                        loading={loadingAutocomplete}
                                    />
                                    
                                    <Autocomplete
                                        options={moneyLocations}
                                        value={currentLoan.moneyLocation || null}
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
                                        value={currentLoan.amount}
                                        onChange={(value) => handleValueChange(value, 'amount')}
                                        label={t('eti_amount')}
                                        required
                                        error={errors.includes('moneyLocation')}
                                        helperText={errors.includes('moneyLocation') ? t('eti_required_field') : ''}
                                        fullWidth
                                        margin="normal"
                                        color="success"
                                    />
                                    
                                    <InputNumber
                                        value={currentLoan.interestRate}
                                        onChange={(value) => handleValueChange(value, 'interestRate')}
                                        label={t('eti_interestrate')}
                                        required
                                        error={errors.includes('interestRate')}
                                        helperText={errors.includes('interestRate') ? t('eti_required_field') : ''}
                                        fullWidth
                                        margin="normal"
                                        color="success"
                                    />

                                </Stack>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                className="btnSave"
                                onClick={handleSaveLoan}
                                title={currentLoan.id ? t('eti_update') : t('eti_save')}
                                startIcon={<Save/>}
                                variant="contained"
                            >
                                {currentLoan.id ? t('eti_update') : t('eti_save')}
                            </Button>

                        </DialogActions>

                        <LoadingBlocker open={loading} parentRef={dialogRef}/>
                    </div>
                </Dialog>
                

            </div>
        </div>
    );
};

export default Loan;