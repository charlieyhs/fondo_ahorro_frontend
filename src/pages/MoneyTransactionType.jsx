import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/menus/Sidebar";
import Message from "../components/Messages/Message";
import apiClient from "../clients/apiClient";
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
import { useTranslation } from "react-i18next";
import { Add, Close, Delete, Edit } from "@mui/icons-material";
import { formatDatetime } from "../utils/DateUtil";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import LoadingBlocker from "../components/Loaders/LoadingBlocker";
import { GREEN_COLOR, RED_DELETE } from "../css/General";

const BASE_URL = "moneytransaction/moneytransactiontypes";

const TYPE_COLORS = {
  INCOME: GREEN_COLOR,
  EXPENSE: RED_DELETE,
  TRANSFER: "#1565c0"
};

const MoneyTransactionType = () => {
    const {t} = useTranslation();
    const dialogRef = useRef(null);
    const [severityMessage, setSeverityMessage] = useState('warning');
    const [message, setMessage] = useState(null);
    const [types, setTypes] = useState([]);
    const [typesOptions, setTypesOptions] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const emptyType = () => {
        return {
            name : '',
            description : '',
            type : '',
            updatedAt : null
        };
    }

    const [currentType, setCurrentType] = useState(emptyType());
    
    const getTypes = async() => {
        try{
            const res = await apiClient.get(BASE_URL);
            if(res.data){
                setTypes(res.data);
            }else{
                setSeverityMessage('warning');
                setMessage('Error obtaining the types');
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining the types');
            }
        }
    };

    const handleOpenDialog = () => {
        setDialog(true);
        setErrors([]);
    };

    const handleCloseDialog = () => {
        setCurrentType(emptyType());
        setDialog(false);
    };

    const handleOpenEditDialog = (row) => {
        setCurrentType({
            id : row.id,
            name : row.name,
            description : row.description,
            type : row.type,
            updatedAt: new Date(row.updatedAt),
        });
        handleOpenDialog();
    };

    const handleSaveType = async() =>{
            try{
                setLoading(true);
    
                const requiredFields = ['name', 'description','type'];
    
                const missingFields = requiredFields.filter(field => {
                    const value = currentType[field];
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
                if(currentType.id){
                    res = await apiClient.patch(`${BASE_URL}/${currentType.id}`,currentType);
                }else{
                    res = await apiClient.post(BASE_URL, currentType);
                }
    
                if(res.data?.success){
                    setSeverityMessage('success');
                    setMessage(t('eti_action_ok'));
                    getTypes();
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

    const handleDeleteRecord = async(id) => {
        try{
            const res = await apiClient.delete(`${BASE_URL}/${id}`);
            if(res.data?.success){
                setSeverityMessage('success');
                setMessage(t('eti_action_ok'));
                getTypes();
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

    const handleValueChange = (value, field ) => {
        setCurrentType({
            ...currentType,
            [field]: value,
        });
    };

    const getTypesOptions = async() => {
        try{
            const res = await apiClient.get('moneytransaction/typestransaction');
            if(res.data){
                setTypesOptions(res.data);
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error obtaining the field lists');
            }
        }
    };
    useEffect(() => {
        getTypes();
        getTypesOptions();
    }, []);

    return (
        <div className='divPag'>
            <Sidebar />
            <Message severity={severityMessage} open={!!message} onClose={() => setMessage(null)}>
                {message}
            </Message>

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
                    <h1 style={{marginTop: '0px'}}>{t('pag_transactiontype')}</h1>
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
                                <TableCell>{t('eti_name')}</TableCell>
                                <TableCell>{t('eti_description')}</TableCell>
                                <TableCell>{t('eti_type')}</TableCell>
                                <TableCell>{t('eti_updatedat')}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                types.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={t('eti_moneytransactiontype_'+row.type)}
                                                sx={{
                                                    backgroundColor: TYPE_COLORS[row.type],
                                                    color: 'white',
                                                }}
                                                variant="filled"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDatetime(row.updatedAt)}</TableCell>
                                        <TableCell>
                                            <div style={{display: 'flex'}}>
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
                                                        style={{marginLeft: '5px'}}
                                                        className="btnDelete"
                                                        title={t('btn_delete')}>
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

            <Dialog open={dialog}
                onClose={handleCloseDialog}
                maxWidth='sm'
                fullWidth
                disableRestoreFocus>
                <div ref={dialogRef}>
                    <DialogTitle>
                        <Typography variant="h6" component="span">{t('pag_transactiontype_new')}</Typography>
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
                        <Box component='form' sx={{mt: 1}}>
                            <Stack spacing={2}>
                                <TextField
                                    value={currentType.name}
                                    error={errors.includes('name')}
                                    helperText={errors.includes('name') ? t('eti_required_field') : ''}
                                    required
                                    label={t('eti_name')}
                                    color="success"
                                    fullWidth
                                    style={{marginBotton: '15px'}}
                                    onChange={(e) => handleValueChange(e.target.value, 'name')}
                                    slotProps={{
                                        input:{
                                            inputProps: {
                                                maxLength: 50,
                                            }
                                        }
                                    }}
                                />

                                <Autocomplete
                                    value={currentType.type || null}
                                    options={typesOptions}
                                    getOptionLabel={(type) => t('eti_moneytransactiontype_'+type)}
                                    renderInput={(params) => 
                                        <TextField
                                            {...params}
                                            label={t('eti_type')}
                                            error={errors.includes('type')}
                                            helperText={errors.includes('type') ? t('eti_required_field') : ''}
                                            color="success"
                                            required />
                                    }
                                    required
                                    onChange={(_, value) => handleValueChange(value, 'type')}
                                />

                                <TextField
                                    value={currentType.description}
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
                                            inputProps:{maxLength: 200}
                                        }
                                    }}
                                />
                            </Stack>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            className="btnSave"
                            onClick={handleSaveType}
                            title={currentType.id ? t('eti_update') : t('eti_save')}
                        >
                            {currentType.id ? t('eti_update') : t('eti_save')}
                        </Button>
                    </DialogActions>
                    <LoadingBlocker open={loading} parentRef={dialogRef} />
                </div>
            </Dialog>

        </div>
    );
};

export default MoneyTransactionType;