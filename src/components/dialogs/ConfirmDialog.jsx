import { Cancel, CheckCircle, Close} from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { cloneElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingBlocker from "../Loaders/LoadingBlocker";

const ConfirmDialog = ({onConfirm, textQuestion, children}) => {
    const {t} = useTranslation();

    const confirmDialogRef = useRef(null);
    const [open, setOpen] = useState(false); 
    const [loading, setLoading] = useState(false);


    const handleClose = () => setOpen(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
            handleClose();
        }
    };

    return (
        <>
            {cloneElement(children, {onClick: () => setOpen(true)})}
            <Dialog open={open} onClose={handleClose} 
                disableRestoreFocus>
                <div ref={confirmDialogRef}>
                    <LoadingBlocker open={loading} parentRef={confirmDialogRef}/>
                    <DialogTitle>
                        <Typography variant='h6' component='span'>{t('eti_confirmation')}</Typography>
                        <IconButton
                            aria-label='close'
                            onClick={handleClose}
                            title={t('eti_close')}
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
                    
                    <DialogContent>
                        <Typography>{textQuestion}</Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}
                            title={t('eti_cancelar')}
                            startIcon={<Cancel/>}
                            className="button"
                            variant="contained">
                            {t('eti_cancelar')}
                        </Button>

                        <Button onClick={handleConfirm} 
                            className="button btnSave"
                            startIcon={<CheckCircle />}
                            variant="contained">
                            {t('eti_confirm')}
                        </Button>
                    </DialogActions>  
                </div>
            </Dialog>
        </>
    );
};

ConfirmDialog.propTypes = {
    onConfirm : PropTypes.func,
    textQuestion : PropTypes.string,
    children : PropTypes.node,
};

export default ConfirmDialog;