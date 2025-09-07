import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/menus/Sidebar";
import Message from "../components/Messages/Message";
import { Autocomplete, Box, Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    FormControl, 
    FormHelperText, 
    IconButton, 
    InputLabel, 
    MenuItem, 
    Paper, 
    Select, 
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
import { Add, Autorenew, Close, Delete, Edit, Save } from "@mui/icons-material";
import { dateWithoutTimezone, formatDate, formatDatetime } from "../utils/DateUtil";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import DatePicker from "../components/Inputs/DatePicker";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import { formatNumber } from "../utils/NumbersUtil";

const BASE_URL = 'money-location';

const MoneyBoxes = () => {
    const {t} = useTranslation();
    const dialogRef = useRef(null);
    const pagRef = useRef(null);
    const [message, setMessage] = useState();
    const closeMessage = () => setMessage(null);

    const [moneyBoxes, setMoneyBoxes] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPag, setLoadingPag] = useState(false);
    const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
    const [severityMessage, setSeverityMessage] = useState('warning');
    const [responsibles, setResponsibles] = useState([]);
    const [financialInstitutions, setFinancialInstitutions] = useState([]);
    const [rateHistorys, setRateHistorys] = useState([]);

    const isInvestment = [{
        id: "S",
        value: true,
        label: t('eti_yes')
    }, {
        id: "N",
        value: false,        
        label: t('eti_no')
    }];

    const emptyMoneyBox = () => {
        return {
            id : null,
            name : '',
            responsible : null,
            investment : null,
            rateHistory : null,
            updatedAt: null,
            startDate: null,
            locationBalance : null,
            financialInstitution : null
        }
    };

    const [currentMoneyBox, setCurrentMoneyBox] = useState(emptyMoneyBox());

    const handleOpenDialog = () => {
        setDialog(true);
        setErrors([]);
    };

    const handleCloseDialog = () => {
        setCurrentMoneyBox(emptyMoneyBox());
        setDialog(false);
    };

    const handleValueChange = (value, field ) => {
        setCurrentMoneyBox({
            ...currentMoneyBox,
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

            if(autocomplete === 'responsibles'){
                endpoint = 'members/autocomplete';
            }else if(autocomplete === 'rateHistorys'){
                endpoint = 'rate-history/autocomplete';
            }else if(autocomplete === 'financialInstitutions'){
                endpoint = `${BASE_URL}/complete_financial_institutions`;
            }

            const res = await apiClient.get(endpoint, config);

            if(res.data && autocomplete === 'responsibles'){
                setResponsibles(res.data);
            }else if(res.data && autocomplete === 'rateHistorys'){
                setRateHistorys(res.data);
            }else if(autocomplete === 'financialInstitutions'){
                setFinancialInstitutions(res.data);
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
    const handleSaveMoneyBox = async() =>{
        try{
            setLoading(true);

            const requiredFields = ['name', 'responsible','investment','rateHistory','startDate'];

            const missingFields = requiredFields.filter(field => {
                const value = currentMoneyBox[field];
                if (field === 'investment') {
                    return value === null || value === undefined;
                }
                return !value;
            });

            if(missingFields.length > 0){
                setSeverityMessage('warning');
                setMessage(t('eti_fields_required'));
                setErrors(missingFields);
                return;
            }
            setErrors([]);

            let res = null;
            if(currentMoneyBox.id){
                res = await apiClient.patch(`${BASE_URL}/${currentMoneyBox.id}`,currentMoneyBox);
            }else{
                res = await apiClient.post(BASE_URL, currentMoneyBox);
            }

            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getMoneyBoxes();
                handleCloseDialog();
            }

        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else if(currentMoneyBox.id){
                setMessage(t('eti_error_updatedrecord'));
            }else{
                setMessage(t('eti_error_addrecord'));
            }
        }finally{
            setLoading(false);
        }
    };

    const handleOpenEditDialog = (row) => {
        setCurrentMoneyBox({
            id : row.id,
            name : row.name,
            responsible : row.responsible,
            investment : row.investment,
            rateHistory : row.rateHistory,
            updatedAt: new Date(row.updatedAt),
            startDate: dateWithoutTimezone(row.startDate),
            locationBalance : row.locationBalance,
            financialInstitution : row.financialInstitution,
        });
        handleOpenDialog();
    };

    const handleUpdateBalance = async(id) => {
        try{
            setLoadingPag(true);
            const res = await apiClient.patch(`${BASE_URL}/${id}/update_balance`);
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getMoneyBoxes();
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_delete'));
            }
        }finally{
            setLoadingPag(false);
        }
    };

    const handleDeleteRecord = async(id) => {
        try{
            const res = await apiClient.delete(`${BASE_URL}/${id}`);
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getMoneyBoxes();
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_delete'));
            }
        }
    };

    const getMoneyBoxes = async() => {
        try{
            const res = await apiClient.get(BASE_URL);
            if(res.data){
                setMoneyBoxes(res.data);
            }
        }catch(e){
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining money boxes');
            }
        }
    };

    useEffect(() => {
        getMoneyBoxes();
    },[])

    return (
        <div className='divPag' ref={pagRef}>
            <LoadingBlocker open={loadingPag} parentRef={pagRef}/>

            <Message severity={severityMessage} open={!!message} onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width:'100%',
                margin:'20px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1 style={{marginTop: '0px'}}>{t('pag_moneyboxes_title')}</h1>
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
                                <TableCell>{t('eti_financial_institution')}</TableCell>
                                <TableCell>{t('eti_name')}</TableCell>
                                <TableCell>{t('eti_responsible')}</TableCell>
                                <TableCell>{t('eti_isinvestment')}</TableCell>
                                <TableCell>{t('eti_currentrate')}</TableCell>
                                <TableCell>{t('eti_currentbalance')}</TableCell>
                                <TableCell>{t('eti_updatedat')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                moneyBoxes.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>{row.financialInstitution?.name}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.responsible.firstName + " " + row.responsible.lastName}</TableCell>
                                        <TableCell>{row.investment ? t('eti_yes') : t('eti_no')}</TableCell>
                                        <TableCell>{row.rateHistory.rate}</TableCell>
                                        <TableCell>{formatNumber(row.locationBalance?.balance)}</TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>
                                            <div style={{display:'flex', gap: '5px'}}>
                                                <IconButton
                                                    className="btnSave"
                                                    title={t('eti_update_balance')}
                                                    onClick={() => handleUpdateBalance(row.id)}>
                                                    <Autorenew/>
                                                </IconButton>

                                                <IconButton
                                                    className="btnEdit"
                                                    title={t('eti_edit')}
                                                    onClick={() => handleOpenEditDialog(row)}>
                                                    <Edit/>
                                                </IconButton>
                                                <ConfirmDialog
                                                    textQuestion={t('eti_delete_record')}
                                                    onConfirm={() => handleDeleteRecord(row.id)}>
                                                    <IconButton
                                                        className="btnDelete"
                                                        title={t('btn_delete')}>
                                                        <Delete />
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
                
                <Dialog open={dialog}
                    onClose={handleCloseDialog}
                    maxWidth='sm'
                    fullWidth
                    disableRestoreFocus>
                    <div ref={dialogRef}>
                        <DialogTitle>
                            <Typography variant="h6" component="span">{currentMoneyBox.id ? t('eti_update_record')
                                                                : t('pag_moneybox_new')}</Typography>
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
                                        value={currentMoneyBox.startDate}
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
                                        options={financialInstitutions}
                                        value={currentMoneyBox.financialInstitution || null}
                                        required
                                        onChange={(_, value) => handleValueChange(value, 'financialInstitution')}
                                        getOptionLabel={(financialInstitution) => financialInstitution.name}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(_, query) => handleInputChangeAutocomplete(query,'financialInstitutions')}
                                        renderInput={(params) => 
                                            <TextField
                                                {...params}
                                                label={t('eti_financial_institution')}
                                                error={errors.includes('financialInstitution')}
                                                helperText={errors.includes('financialInstitution') ? t('eti_required_field') : ''}
                                                color="succces"
                                                fullWidth
                                                required
                                            />
                                        }
                                        onOpen={() => handleInputChangeAutocomplete('','financialInstitutions')}
                                        loading={loadingAutocomplete}
                                    />

                                    <TextField
                                        value={currentMoneyBox.name}
                                        error={errors.includes('name')}
                                        helperText={errors.includes('name') ? t('eti_required_field') : ''}
                                        required
                                        label={t('eti_name')}
                                        color="success"
                                        fullWidth
                                        onChange={(e) => handleValueChange(e.target.value, 'name')}
                                        slotProps={{
                                            input:{
                                                inputProps: {
                                                    maxLength: 100,
                                                }
                                            }
                                        }}
                                    />
                                    
                                    <Autocomplete
                                        options={responsibles}
                                        value={currentMoneyBox.responsible || null}
                                        required
                                        onChange={(_, value) => handleValueChange(value, 'responsible')}
                                        getOptionLabel={(responsible) => responsible.firstName + ' ' + responsible.lastName}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(_, query) => handleInputChangeAutocomplete(query,'responsibles')}
                                        renderInput={(params) => 
                                            <TextField
                                                {...params}
                                                label={t('eti_responsible')}
                                                error={errors.includes('responsible')}
                                                helperText={errors.includes('responsible') ? t('eti_required_field') : ''}
                                                color='succces'
                                                fullWidth
                                                required
                                            />
                                        }
                                        onOpen={() => handleInputChangeAutocomplete('','responsibles')}
                                        loading={loadingAutocomplete}
                                    />
                                    
                                    <FormControl fullWidth
                                        error={errors.includes('investment')}>
                                        <InputLabel id="eti_isinvestment" color="success">
                                            {t('eti_question_isinvestment')}
                                        </InputLabel>
                                        <Select 
                                            labelId="selectIsInvestment"
                                            color="success"
                                            label={t('eti_question_isinvestment')}
                                            value={currentMoneyBox.investment ?? ''}
                                            onChange={(e) => handleValueChange(e.target.value, 'investment')}
                                            required
                                        >
                                            {isInvestment.map((option) => (
                                                <MenuItem key={option.id} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.includes('investment') ? t('eti_required_field') : ''}
                                        </FormHelperText>
                                    </FormControl>

                                    

                                    <Autocomplete
                                        options={rateHistorys}
                                        value={currentMoneyBox.rateHistory}
                                        required
                                        onChange={(_, value) => handleValueChange(value, 'rateHistory')}
                                        getOptionLabel={(rateHistory) => rateHistory.name + " (" + rateHistory.rate + ")"}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(_, query) => handleInputChangeAutocomplete(query, 'rateHistorys')}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label={t('eti_ratehistory')}
                                                error={errors.includes('rateHistory')}
                                                helperText={errors.includes('rateHistory') ? t('eti_required_field') : ''}
                                                color='success'
                                                fullWidth
                                                required
                                            />
                                        }
                                        onOpen={() => handleInputChangeAutocomplete('', 'rateHistorys')}
                                        loading={loadingAutocomplete}
                                    />
                                </Stack>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                className="btnSave"
                                onClick={handleSaveMoneyBox}
                                title={currentMoneyBox.id ? t('eti_update') : t('eti_save')}
                                startIcon={<Save/>}
                                variant="contained"
                            >
                                {currentMoneyBox.id ? t('eti_update') : t('eti_save')}
                            </Button>

                        </DialogActions>

                        <LoadingBlocker open={loading} parentRef={dialogRef}/>
                    </div>
                </Dialog>
                

            </div>
        </div>
    );
};

export default MoneyBoxes;