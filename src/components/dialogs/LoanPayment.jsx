import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  TextField,
} from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, CheckCircle } from '@mui/icons-material';
import { formatNumber } from '../../utils/NumbersUtil';
import InputNumber from '../Inputs/InputNumber';
import DatePicker from '../Inputs/DatePicker';
import { formatDate } from '../../utils/DateUtil';
import LoadingBlocker from '../Loaders/LoadingBlocker';
import Message from '../Messages/Message';
import apiClient from '../../clients/apiClient';

const BASE_URL = 'loan';

const LoanPayment = ({ isOpen, onClose, loan }) => {
    const dialogRef = useRef(null);
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [paymentOption, setPaymentOption] = useState('full');
    const [loading, setLoading] = useState(false);
    const [recordingPayment, setRecordingPayment] = useState(false);
    const [severityMessage, setSeverityMessage] = useState('warning');
    const [message, setMessage] = useState();

    const emptyPayment = () => {
        return {
            amount : null,
            paymentDate : null,
            paymentId : null,
            description : '',
        };
    };

    const [payment, setPayment] = useState(emptyPayment());

    const handleClose = () => {
        setCurrentStep(0);
        setPaymentOption('full');
        setPayment(emptyPayment());
        onClose();
    };

    const steps = [
        t('paymentSteps.selection'),
        t('paymentSteps.success')
    ];

    // Calcular el monto actual de pago
    const getCurrentPaymentAmount = () => {
        if (paymentOption === 'full') {
            return loan.totalPayment || 0;
        }else if(paymentOption === 'min'){
            return loan.quotaValue;
        }
        return payment.amount || 0;
    };

    const handleValueChange = (value, field ) => {
        setPayment({
            ...payment,
            [field]: value,
        });
    };

    // Vista de selección de pago
    const renderSelectionView = () => (
        <>
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                <FormLabel component="legend">{t('paymentSelection.title')}</FormLabel>
                <RadioGroup
                    value={paymentOption}
                    onChange={(e) => setPaymentOption(e.target.value)}
                >
                    <FormControlLabel 
                    value="full" 
                    control={<Radio />} 
                    label={t('paymentOptions.fullAmount')} 
                    />
                    <FormControlLabel 
                    value="min" 
                    control={<Radio />} 
                    label={t('paymentOptions.minValue')} 
                    />
                    <FormControlLabel 
                    value="custom" 
                    control={<Radio />} 
                    label={t('paymentOptions.customAmount')} 
                    />
                </RadioGroup>
            </FormControl>

            {paymentOption === 'custom' && (
                <InputNumber
                    value={payment.amount}
                    onChange={(value) => handleValueChange(value, 'amount')}
                    label={t('paymentSelection.enterAmount')}
                    required
                    fullWidth
                    color="success"
                    sx={{ mb: 3 }}
                    max={loan.totalPayment}
                />
                
                )
            }

            <DatePicker 
                label={t('eti_startdate')}
                value={payment.paymentDate}
                onChange={(newValue) => handleValueChange(newValue, 'paymentDate') }
                slotProps={{
                    textField: {
                        required: true,
                        color: 'success',
                        fullWidth: true,
                    }
                }}
            />

            <TextField
                value={payment.description}
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

            <Paper variant="outlined" sx={{ p: 2, mb: 3, marginTop: '10px' }}>
                <Typography variant="h6" gutterBottom>
                    {t('paymentDetails.title')}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography>{t('loanDetails.member')}:</Typography>
                    <Typography>{loan.member.firstName + ' ' + loan.member.lastName }</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('loanDetails.loanCode')}:</Typography>
                    <Typography>{loan.code}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('paymentDetails.initialAmount')}:</Typography>
                    <Typography>${formatNumber(loan.amount)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('paymentDetails.interestRate')}:</Typography>
                    <Typography>{formatNumber(loan.interestRate)}%</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('paymentDetails.balance')}:</Typography>
                    <Typography>${formatNumber(loan.currentBalance)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('paymentDetails.quotaValue')}:</Typography>
                    <Typography>${formatNumber(loan.quotaValue)}</Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold">{t('paymentDetails.currentPayment')}:</Typography>
                    <Typography fontWeight="bold">
                        ${getCurrentPaymentAmount().toFixed(2)}
                    </Typography>
                </Box>
            </Paper>
        </>
    );

    // Vista de pago exitoso
    const renderSuccessView = () => {

        return (
            <Box textAlign="center">
                <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    {t('paymentSuccess.title')}
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('loanDetails.member')}:</Typography>
                    <Typography>{loan.member.firstName + ' ' + loan.member.lastName }</Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('loanDetails.loanCode')}:</Typography>
                    <Typography>{loan.code}</Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('paymentSuccess.amountPaid')}:</Typography>
                    <Typography>${formatNumber(payment.amount)}</Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>{t('paymentSuccess.date')}:</Typography>
                    <Typography>{formatDate(payment.paymentDate)}</Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between">
                    <Typography>{t('paymentSuccess.reference')}:</Typography>
                    <Typography>{payment.paymentId}</Typography>
                    </Box>
                </Paper>
            </Box>
        );
    };


    const renderStepContent = (step) => {
    switch (step) {
        case 0:
            return renderSelectionView();
        case 1:
            return renderSuccessView();
        default:
            return <div>{t('common.unknownStep')}</div>;
    }
    };


    const isNextDisabled = () => {
        if(currentStep == 0) {
            return !payment.paymentDate 
                || (paymentOption === 'custom' && 
                    (!payment.amount || payment.amount < loan.quotaValue || payment.amount > loan.currentBalance));
        }
        return false;
    };

    const registerPayment = async() => {
        try{
            setRecordingPayment(true);
            setLoading(true);
            if(!payment.amount){
                payment.amount = getCurrentPaymentAmount();
            }
            const res = await apiClient.post(`${BASE_URL}/${loan.id}/payments`, payment);
            if(res.data){
                setPayment(res.data);
                setCurrentStep(currentStep + 1);
            }
        }catch(e){
            setSeverityMessage('warning');
            if(e.response){
                setMessage(e.response.data.message);
            }else{
                setMessage('error recording the payment');
            }
        }finally{
            setLoading(false);
            setRecordingPayment(false);
        }
    };

    const handleNext = () => {
        if (currentStep === steps.length - 1) {
            handleClose();
        } else {
            registerPayment();
        }
    };


    return (
        <Dialog open={isOpen} 
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth
        >   
            <div ref={dialogRef}>
                <Message severity={severityMessage} open={!!message} onClose={() => setMessage(null)}>
                    {message}
                </Message>
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">
                        {currentStep === 0 && t('paymentSelection.mainTitle')}
                        {currentStep === 1 && t('paymentSuccess.mainTitle')}
                        </Typography>
                        <IconButton onClick={handleClose}>
                        <CloseIcon />
                        </IconButton>
                    </Box>
                    <Stepper activeStep={currentStep} sx={{ mt: 2}} >
                        {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                </DialogTitle>

                <DialogContent>
                    {renderStepContent(currentStep)}
                </DialogContent>

                <DialogActions>
                    {currentStep == 0 ? (
                        <Button 
                            onClick={handleNext} 
                            variant="contained" 
                            className={recordingPayment || isNextDisabled() ? 'btn-disabled' : 'btnSave'}
                            endIcon={<CheckCircle/>}
                            disabled={recordingPayment || isNextDisabled()}
                            >
                            {t('common.confirm')}
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleClose} 
                            variant="contained"
                            className='button'
                            >
                            {t('paymentSuccess.returnToLoan')}
                        </Button>
                    )}
                </DialogActions>
                <LoadingBlocker open={loading} parentRef={dialogRef}/>
            </div>
        </Dialog>
    );
};

LoanPayment.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    loan: PropTypes.shape({
        id: PropTypes.string, 
        member: PropTypes.object,
        amount: PropTypes.number,
        interestRate: PropTypes.number,
        code: PropTypes.string,
        quotaValue: PropTypes.number,
        currentBalance : PropTypes.number,
        totalPayment : PropTypes.number
    }).isRequired
};

export default LoanPayment;