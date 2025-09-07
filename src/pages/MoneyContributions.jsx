import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/menus/Sidebar";
import Message from "../components/Messages/Message";
import { useTranslation } from "react-i18next";
import { Autocomplete, 
    Box, 
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
import { Add, Close, Edit } from "@mui/icons-material";
import { formatDate, formatDatetime } from "../utils/DateUtil";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import apiClient from "../clients/apiClient";
import InputNumber from "../components/Inputs/InputNumber";
import DatePicker from "../components/Inputs/DatePicker";
import { formatNumber } from "../utils/NumbersUtil";

const BASE_URL = 'fund-contribution';

const MoneyContributions = () => {
    const dialogRef = useRef(null);
    const {t} = useTranslation();
    const [severityMessage, setSeverityMessage] = useState('warning');
    const [message, setMessage] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [states, setStates] = useState([]);
    const [moneyLocations, setMoneyLocations] = useState([]);
    const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);

    const getContributions = async() => {
        try{
            const res = await apiClient.get(BASE_URL);
            setContributions(res.data);
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining the contributions');
            }
        }
    };

    const getStates = async() => {
        try{
            const res = await apiClient.get(`${BASE_URL}/states`);
            setStates(res.data);
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining the states');
            }
        }
    };

    useEffect(() => {
        getContributions();
        getStates();
    }, []);

    const emptyContribution = () => ({
            contributionDate : null,
            member : null,
            amount : null,
            updatedAt : null,
            moneyLocation : null,
            description : null,
            status : null,
        }
    );

    const [currentContribution, setCurrentContribution] = useState(emptyContribution());
    
    const handleOpenDialog = () => {
        setDialog(true);
        setErrors([]);
    };
    const handleCloseDialog = () => {
        setCurrentContribution(emptyContribution());
        setDialog(false);
    };
    const handleOpenEditDialog = (row) => {
        setCurrentContribution({
            id : row.id,
            contributionDate : new Date(row.contributionDate),
            member : row.member,
            amount : row.amount,
            updatedAt : new Date(row.updatedAt),
            moneyLocation : row.moneyLocation,
            description : row.description,
            status : row.status,
        });
        handleOpenDialog();
    };

    const handleSaveContribution = async() => {
        try{
            setLoading(true);

            const requiredFields = ['contributionDate','member','amount','moneyLocation', 'description', 'status'];
            const missingFields = requiredFields.filter(field => {
                const value = currentContribution[field];
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
            if(currentContribution.id){
                res = await apiClient.patch(`${BASE_URL}/${currentContribution.id}`, currentContribution);
            }else{
                res = await apiClient.post(BASE_URL, currentContribution);
            }
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getContributions();
                handleCloseDialog();
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else if(currentContribution.id){
                setMessage(t('eti_error_updatedrecord'));
            }else{
                setMessage(t('eti_error_addrecord'));
            }
        }finally{
            setLoading(false);
        }
    };

    const handleValueChange = (value, field) => {
        setCurrentContribution({
            ...currentContribution,
            [field] : value
        });
    };

    const handleInputChangeAutocomplete = async(query, autocomplete) => {
        try{
            setLoadingAutocomplete(true);
            let endpoint = null;
            const config = {
                params: {
                    query : query
                }
            }
            if(autocomplete === 'members'){
                endpoint = 'members/autocomplete';
            }else if(autocomplete === 'moneyLocations'){
                endpoint = 'money-location/autocomplete';
            }

            const res = await apiClient.get(endpoint, config);

            if(res.data && autocomplete === 'members'){
                setMembers(res.data);
            }else if(res.data && autocomplete === 'moneyLocations'){
                setMoneyLocations(res.data);
            }

        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_obtainingdata'));
            }
        }
    };

    return (
        <div className='divPag'>
            <Message severity={severityMessage} open={!!message} onClose={() => setMessage(null)}>
                {message}
            </Message>
            <Sidebar />

            <div className="divRight">
                <div className="divTitleBtnNew">
                    <h1 style={{marginTop: '0px'}}>{t('pag_moneycontributions')}</h1>
                    <Button type="button"
                        className="button"
                        variant="contained"
                        title={t('eti_new')}
                        startIcon={<Add/>}
                        onClick={handleOpenDialog}>
                        {t('eti_new')}
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_contribution_date')}</TableCell>
                                <TableCell>{t('eti_state')}</TableCell>
                                <TableCell>{t('eti_member')}</TableCell>
                                <TableCell>{t('eti_moneylocation')}</TableCell>
                                <TableCell>{t('eti_amount')}</TableCell>
                                <TableCell>{t('eti_description')}</TableCell>
                                <TableCell>{t('eti_updatedat')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                contributions.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{formatDate(row.contributionDate)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={t('eti_state_' + row.status)}
                                                color={row.status === 'CONFIRMED' ? 'success' : 'error'}
                                                variant="filled"
                                                style={{color:'#fff'}}
                                            />
                                        </TableCell>
                                        <TableCell>{row.member.firstName + ' ' + row.member.lastName}</TableCell>
                                        <TableCell>{row.moneyLocation.name}</TableCell>
                                        <TableCell>{formatNumber(row.amount)}</TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>
                                            <div style={{display: 'flex'}}>
                                                <IconButton
                                                    className="btnEdit"
                                                    title={t('eti_edit')}
                                                    onClick={() => handleOpenEditDialog(row)}>
                                                    <Edit/>
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={dialog}
                onClose={handleCloseDialog}
                maxWidth='sm'
                fullWidth
                disableRestoreFocus>
                <div ref={dialogRef}>
                    <DialogTitle>
                        <Typography variant="h6" component="span">{currentContribution.id ? t('eti_update_record')
                                            : t('pag_moneycontributions_new')}</Typography>
                        <IconButton
                            aria-label={t('eti_close')}
                            onClick={handleCloseDialog}
                            title={t('eti_close')}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                            }}>
                            <Close/>
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        <Box component='form' sx={{mt: 1}}>
                            <Stack spacing={2}>
                                <Autocomplete
                                    options={members}
                                    value={currentContribution.member || null}
                                    required
                                    onChange={(_, value) => handleValueChange(value, 'member')}
                                    getOptionLabel={(member) => member.firstName + ' ' + member.lastName}
                                    onInputChange={(_, query) => handleInputChangeAutocomplete(query, 'members')}
                                    renderInput={(params) => 
                                        <TextField
                                            {...params}
                                            label={t('eti_member')}
                                            error={errors.includes('member')}
                                            helperText={errors.includes('member') ? t('eti_required_field') : ''}
                                            color="success"
                                            fullWidth
                                            required
                                        />
                                    }
                                    onOpen={() => handleInputChangeAutocomplete('', 'members')}
                                    loading={loadingAutocomplete}
                                />

                                <Autocomplete
                                    options={moneyLocations}
                                    value={currentContribution.moneyLocation || null}
                                    required
                                    onChange={(_, value) => handleValueChange(value, 'moneyLocation')}
                                    getOptionLabel={(location) => location.name}
                                    onInputChange={(_, query) => handleInputChangeAutocomplete(query, 'moneyLocations')}
                                    renderInput={(params) => 
                                        <TextField
                                            {...params}
                                            label={t('eti_moneylocation')}
                                            error={errors.includes('moneyLocation')}
                                            helperText={errors.includes('moneyLocation') ? t('eti_required_field') : ''}
                                            color="success"
                                            fullWidth
                                            required
                                        />
                                    }
                                    onOpen={() => handleInputChangeAutocomplete('', 'moneyLocations')}
                                    loading={loadingAutocomplete}
                                />

                                <Autocomplete
                                    value={currentContribution.status || null}
                                    options={states}
                                    getOptionLabel={(status) => t('eti_state_'+status)}
                                    renderInput={(params) => 
                                        <TextField
                                            {...params}
                                            label={t('eti_state')}
                                            error={errors.includes('status')}
                                            helperText={errors.includes('status') ? t('eti_required_field') : ''}
                                            color="success"
                                            required />
                                    }
                                    required
                                    onChange={(_, value) => handleValueChange(value, 'status')}
                                />

                                <InputNumber
                                    value={currentContribution.amount}
                                    onChange={(value) => handleValueChange(value, 'amount')}
                                    min={0}
                                    decimalPlaces={2}
                                    label={t('eti_amount')}
                                    required
                                    error={errors.includes('amount')}
                                    helperText={errors.includes('amount') ? t('eti_required_field') : ''}
                                    fullWidth
                                    margin="normal"
                                    color="success"/>

                                <DatePicker
                                    label={t('eti_contribution_date')}
                                    value={currentContribution.contributionDate}
                                    onChange={(newValue) => handleValueChange(newValue, 'contributionDate')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            margin: 'normal',
                                            required: true,
                                            error: errors.includes('contributionDate'),
                                            helperText: errors.includes('contributionDate') ? t('eti_required_field') : '',
                                        }
                                    }}
                                />

                                <TextField
                                    value={currentContribution.description || ''}
                                    error={errors.includes('description')}
                                    helperText={errors.includes('description') ? t('eti_required_field') : ''}
                                    required
                                    label={t('eti_description')}
                                    color="success"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    onChange={(e) => handleValueChange(e.target.value, 'description')}
                                    slotProps={{
                                        input:{
                                            inputProps:{maxLength: 150}
                                        }
                                    }}
                                />

                            </Stack>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            className="btnSave"
                            onClick={handleSaveContribution}
                            title={currentContribution.id ? t('eti_update') : t('eti_save')}>
                            {currentContribution.id ? t('eti_update') : t('eti_save')}
                        </Button>
                    </DialogActions>
                    <LoadingBlocker open={loading} parentRef={dialogRef} />
                </div>
            </Dialog>

        </div>
    );
};

export default MoneyContributions;