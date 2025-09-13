import { 
    Box,
    Button,
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    IconButton, 
    Stack, 
    TextField, 
    Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import Message from "../Messages/Message";
import { useTranslation } from "react-i18next";
import { Close, Done} from "@mui/icons-material";
import LoadingBlocker from "../Loaders/LoadingBlocker";
import ConfirmDialog from "./ConfirmDialog";
import apiClient from "../../clients/apiClient";
import InputNumber from "../Inputs/InputNumber";

const BASE_URL = "investment";

const InvestmentYield = ({isOpen, onClose, investment}) => {
    const dialogRef = useRef(null);
    const {t} = useTranslation();

    const [severityMessage, setSeverityMessage] = useState('warning');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const emptyYield = () => (
        {
            amount : 0,
            description : ''
        }
    );

    const [invYield, setInvYield] = useState(emptyYield());

    const handleCloseDlg = () => {
        setInvYield(emptyYield());
        onClose();
    };

    const handleCloseInvestment = async () => {
        try{
            setLoading(true);
            const res = await apiClient.post(`${BASE_URL}/${investment.id}/close`, invYield);
            if(res.data?.success){
                handleCloseDlg();
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('Error closing the investment');
            }
        }finally{
            setLoading(false);
        }
    };

    const handleValueChange = (value, field ) => {
        setInvYield({
            ...invYield,
            [field]: value,
        });
    };

    return (
        <Dialog open={isOpen}
            onClose={handleCloseDlg}
            maxWidth='sm'
            fullWidth
            disableRestoreFocus>
            <div ref={dialogRef}>
                <Message severity={severityMessage} open={!!message} onClose={() => setMessage(null)}>
                    {message}
                </Message>
                <DialogTitle>
                    <Typography variant='h6' component='span'>{t('eti_close_investment')}</Typography>
                    <IconButton
                        aria-label={t('eti_close')}
                        onClick={handleCloseDlg}
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
                <DialogContent>
                    <Box component="form" sx={{mt: 1}}>
                        <Stack spacing={2}>
                            <InputNumber
                                value={invYield.amount}
                                onChange={(value) => handleValueChange(value, 'amount')}
                                label={t('pagInvestment.closeInvestment.yield')}
                                required
                                fullWidth
                                color="success"/>

                            <TextField
                                value={invYield.description}
                                required
                                label={t('eti_description')}
                                color="success"
                                fullWidth
                                multiline
                                rows={4}
                                onChange={(e) => handleValueChange(e.target.value, 'description')}
                                slotProps={{
                                    input: {
                                        inputProps: {maxLength: 200}
                                    }
                                }}
                            />
                        </Stack>
                    </Box>

                </DialogContent>

                <DialogActions>
                    <ConfirmDialog
                        textQuestion={t('eti_question_close_investment')}
                        onConfirm={() => handleCloseInvestment()}>
                        <Button
                            className="btnSave"
                            startIcon={<Done/>}
                            variant='contained'
                            title={t('eti_close_investment')}>
                            {t('eti_close_investment')}
                        </Button>
                    </ConfirmDialog>
                </DialogActions>
                <LoadingBlocker open={loading} parentRef={dialogRef}/>
            </div>
        </Dialog>
    );

};

InvestmentYield.propTypes = {
    isOpen : PropTypes.bool,
    onClose : PropTypes.func,
    investment : PropTypes.object
};

export default InvestmentYield;