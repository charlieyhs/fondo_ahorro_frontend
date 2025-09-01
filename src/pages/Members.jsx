import { Autocomplete, 
    Box, 
    Button, 
    Chip, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Grid, 
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
import Sidebar from "../components/menus/Sidebar";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import apiClient from "../clients/apiClient";
import Message from "../components/Messages/Message";
import { dateWithoutTimezone, formatDate } from "../utils/DateUtil";
import { Add, Close, Delete, Edit, Save } from "@mui/icons-material";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import DatePicker from "../components/Inputs/DatePicker";
import dayjs from "dayjs";
import { validateEmail } from "../utils/EmailValidator";

const GENDER_COLOR = {
        M: '#1976d2',
        F: '#d81b60',
        O: '#9e9e9e',
    };

const Members = () => {

    const {t} = useTranslation();
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState();
    const [severity, setSeverity] = useState('warning');
    const [openDlg, setOpenDlg] = useState(false);
    const dialogRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const closeMessage = () => setMessage(null);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [genders, setGenders] = useState([]);
    const [states, setStates] = useState([]);
    const [helperTextEmail, setHelperTextEmail] = useState('');

    const emptyMember = () => {
        return {
            documentType : '',
            documentNumber : '',
            firstName : '',
            lastName : '',
            birthDate : null,
            gender : '',
            state : '',
            phone : '',
            email : '',
            address : '',
            startDate : null
        };
    };

    const [currentMember, setCurrentMember] = useState(emptyMember());
    const [errors, setErrors] = useState([]);

    const getMembers = async () => {
        try{
            const res = await apiClient.get('members');
            if(res.data){
                setMembers(res.data);
            }else{
                setSeverity('warning');
                setMessage('Error obtaining the members');
            }
        }catch(e){
            setSeverity('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining the members');
            }
        }
    }

    const getFieldLists = async () => {
        try{
            const res = await apiClient.get('members/fieldlists');
            if(res.data?.success){
                setDocumentTypes(res.data?.data?.documentTypes);
                setGenders(res.data?.data?.genders);
                setStates(res.data?.data?.states);
            }
        }catch(e){
            setSeverity('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining the field lists');
            }
        }
    }

    useEffect(() => {
        getMembers();
        getFieldLists();
    }, []);

    const handleDeleteRecord = async(id) => {
        try{
            const res = await apiClient.delete(`members/${id}`);
            if(res.data?.success){
                setSeverity('success');
                setMessage(t('eti_action_ok'));
                getMembers();
            }
        }catch(e){
            setSeverity('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage(t('eti_error_delete'));
            }
        }
    };

    const handleOpenDialog = () => {
        setOpenDlg(true);
        setErrors([]);
    };

    const handleCloseDialog = () => {
        setCurrentMember(emptyMember());
        setHelperTextEmail(null);
        setOpenDlg(false);
    };
    
    const handleOpenEditDialog = (row) => {
        setCurrentMember({
            id : row.id,
            documentType : row.documentType,
            documentNumber : row.documentNumber,
            firstName : row.firstName,
            lastName : row.lastName,
            birthDate : row.birthDate ? dateWithoutTimezone(row.birthDate) : null,
            gender : row.gender,
            state : row.state,
            phone : row.phone,
            email : row.email,
            address : row.address,
            startDate : dateWithoutTimezone(row.startDate)
        });
        handleOpenDialog();
    };

    const handleValueChange = (value, field) => {
        setCurrentMember({
            ...currentMember,
            [field]: value,
        });
    };

    const handleSaveMember = async() => {
        try{
            setLoading(true);
            const requiredFields = ['documentType','documentNumber','firstName',
                'lastName','gender','state','phone','email','address', 'startDate'];

            const missingFields = requiredFields.filter(field => {
                const value = currentMember[field];
                return !value;
            });

            if(missingFields.length > 0){
                setHelperTextEmail(t('eti_required_field'));
                setErrors(missingFields);
                setSeverity('warning');
                setMessage(t('eti_fields_required'));
                return;
            }
            
            if(!validateEmail(currentMember.email)){
                setErrors(["email"]);
                setHelperTextEmail(t('eti_invalid_email'));
                setSeverity('warning');
                setMessage(t('eti_fields_required'));
                return;
            }
            setErrors([]);

            let res = null;
            if(currentMember.id){
                res = await apiClient.patch(`members/${currentMember.id}`, currentMember);
            }else{
                res = await apiClient.post('members', currentMember);
            }
            if(res.data?.success){
                setSeverity('success');
                setMessage(t('eti_action_ok'));
                getMembers();
                handleCloseDialog();
            }

        }catch(e){
            setSeverity('warning');
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
            
            <Message severity={severity} open={!!message} onClose={closeMessage}>
                {message}
            </Message>
            <Sidebar />
            <div style={{display: 'flex', 
                        flexDirection:'column', 
                        width: '100%', 
                        margin: '20px'}}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1 style={{marginTop: '0px'}}>{t('pag_members')}</h1>
                    <Button type="button"
                        className="button"
                        variant="contained"
                        title={t('eti_new')}
                        startIcon={<Add />}
                        onClick={handleOpenDialog}
                    >
                        {t('eti_new')}
                    </Button>
                </div>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('eti_startdate')}</TableCell>
                                <TableCell>{t('eti_state')}</TableCell>
                                <TableCell>{t('eti_name')}</TableCell>
                                <TableCell>{t('eti_lastname')}</TableCell>
                                <TableCell>{t('eti_age')}</TableCell>
                                <TableCell>{t('eti_documenttype')}</TableCell>
                                <TableCell>{t('eti_documentnumber')}</TableCell>
                                <TableCell>{t('eti_gender')}</TableCell>
                                <TableCell>{t('eti_phone')}</TableCell>
                                <TableCell>{t('eti_email')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                members.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{formatDate(row.startDate)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={t('eti_state_' + row.state)}
                                                color={row.state === 'ACTIVE' ? 'success' : 'error'}
                                                variant="filled"
                                                style={{color:'#fff'}}
                                            />
                                        </TableCell>

                                        <TableCell>{row.firstName}</TableCell>
                                        <TableCell>{row.lastName}</TableCell>
                                        <TableCell>{row.age}</TableCell>
                                        <TableCell>{row.documentType}</TableCell>
                                        <TableCell>{row.documentNumber}</TableCell>
                                        
                                        <TableCell>
                                            <Chip
                                                label={t('eti_gender_' + row.gender)}
                                                sx={{
                                                    backgroundColor: GENDER_COLOR[row.gender],
                                                    color: 'white',
                                                }}
                                            />
                                        </TableCell>
                                        
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell>{row.email}</TableCell>

                                        <TableCell>
                                            <div style={{display:'flex'}}>
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
                                                        style={{marginLeft:'5px'}}
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
            </div>

            <Dialog open={openDlg}
                onClose={handleCloseDialog}
                maxWidth='sm'
                fullWidth
                disableRestoreFocus>
                
                <div ref={dialogRef}>
                    <DialogTitle>
                        <Typography variant="h6" component="span">{t('pag_member_new')}</Typography>
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
                        <Box component='form' sx={{mt: 1}} >
                            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <DatePicker
                                        label={t('eti_startdate')}
                                        value={currentMember.startDate}
                                        onChange={(newValue) => handleValueChange(newValue, 'startDate')}
                                        slotProps={{
                                            textField:{
                                                required: true,
                                                error: errors.includes('startDate'),
                                                helperText: errors.includes('startDate') ? t('eti_required_field') : '',
                                                color: 'success',
                                                fullWidth: true
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <Autocomplete
                                        value={currentMember.state || null}
                                        options={states}
                                        getOptionLabel={(state) => t('eti_state_'+state)}
                                        renderInput={(params) => 
                                            <TextField
                                                {...params}
                                                label={t('eti_state')}
                                                error={errors.includes('state')}
                                                helperText={errors.includes('state') ? t('eti_required_field') : ''}
                                                color="success"
                                                fullWidth
                                                required/>
                                        }
                                        required
                                        onChange={(_,value) => handleValueChange(value, 'state')}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <Autocomplete
                                        value={currentMember.documentType || null}
                                        options={documentTypes}
                                        getOptionLabel={(type) => t('documentype_'+type)}
                                        renderInput={(params) => 
                                            <TextField
                                                {...params}
                                                label={t('eti_documenttype')}
                                                error={errors.includes('documentType')}
                                                helperText={errors.includes('documentType') ? t('eti_required_field') : ''}
                                                color="success"
                                                required/>
                                        }
                                        required
                                        onChange={(_,value) => handleValueChange(value, 'documentType')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        value={currentMember.documentNumber}
                                        error={errors.includes('documentNumber')}
                                        helperText={errors.includes('documentNumber') ? t('eti_required_field') : ''}
                                        required
                                        label={t('eti_documentnumber')}
                                        color="success"
                                        fullWidth
                                        onChange={(e) => handleValueChange(e.target.value, 'documentNumber')}
                                        slotProps={{
                                            input:{
                                                inputProps:{
                                                    maxLength: 20,
                                                }
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        value={currentMember.firstName}
                                        error={errors.includes('firstName')}
                                        helperText={errors.includes('firstName') ? t('eti_required_field') : ''}
                                        required
                                        label={t('eti_name')}
                                        color="success"
                                        fullWidth
                                        onChange={(e) => handleValueChange(e.target.value, 'firstName')}
                                        slotProps={{
                                            input:{
                                                inputProps:{maxLength: 100}
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        value={currentMember.lastName}
                                        error={errors.includes('lastName')}
                                        helperText={errors.includes('lastName') ? t('eti_required_field') : ''}
                                        required
                                        label={t('eti_lastname')}
                                        color="success"
                                        fullWidth
                                        onChange={(e) => handleValueChange(e.target.value, 'lastName')}
                                        slotProps={{
                                            input:{
                                                inputProps:{maxLength: 100}
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <DatePicker
                                        label={t('eti_birthdate')}
                                        value={currentMember.birthDate}
                                        onChange={(newValue) => handleValueChange(newValue, 'birthDate')}
                                        slotProps={{
                                            textField:{
                                                fullWidth: true,
                                                color: 'success',
                                            }
                                        }}
                                        maxDate={dayjs()}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <Autocomplete
                                        value={currentMember.gender || null}
                                        options={genders}
                                        getOptionLabel={(gender) => t('eti_gender_'+gender)}
                                        renderInput={(params) => 
                                            <TextField
                                                {...params}
                                                label={t('eti_gender')}
                                                error={errors.includes('gender')}
                                                helperText={errors.includes('gender') ? t('eti_required_field') : ''}
                                                color="success"
                                                required/>
                                        }
                                        required
                                        onChange={(_,value) => handleValueChange(value, 'gender')}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        value={currentMember.phone}
                                        error={errors.includes('phone')}
                                        helperText={errors.includes('phone') ? t('eti_required_field') : ''}
                                        required
                                        label={t('eti_phone')}
                                        color="success"
                                        fullWidth
                                        onChange={(e) => handleValueChange(e.target.value, 'phone')}
                                        slotProps={{
                                            input:{
                                                inputProps:{maxLength: 20}
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        value={currentMember.email}
                                        error={errors.includes('email')}
                                        helperText={errors.includes('email') ? helperTextEmail : ''}
                                        required
                                        label={t('eti_email')}
                                        color="success"
                                        type="email"
                                        fullWidth
                                        onChange={(e) => handleValueChange(e.target.value, 'email')}
                                        slotProps={{
                                            input:{
                                                inputProps:{maxLength: 100}
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }} >
                                    <TextField
                                        value={currentMember.address}
                                        error={errors.includes('address')}
                                        helperText={errors.includes('address') ? t('eti_required_field') : ''}
                                        required
                                        label={t('eti_address')}
                                        color="success"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        onChange={(e) => handleValueChange(e.target.value, 'address')}
                                        slotProps={{
                                            input:{
                                                inputProps:{maxLength: 255}
                                            }
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            className="btnSave"
                            onClick={handleSaveMember}
                            startIcon={<Save/>}
                            variant="contained"
                            title={currentMember.id ? t('eti_update') : t('eti_save')}
                        >
                            {currentMember.id ? t('eti_update') : t('eti_save')}
                        </Button>
                    </DialogActions>

                    <LoadingBlocker open={loading} parentRef={dialogRef} />
                </div>

            </Dialog>

        </div>
    );
};

export default Members;