import { Alert, Snackbar } from "@mui/material";
import PropTypes from "prop-types";


const Message = ({open=false, severity, children, onClose}) => {

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={onClose}>
            <Alert severity={severity} onClose={onClose} variant='standard'>
                {children}
            </Alert>
        </Snackbar>
    );
}

Message.propTypes = {
    open : PropTypes.bool,
    children : PropTypes.node.isRequired,
    onClose : PropTypes.func.isRequired,
    severity : PropTypes.string.isRequired
};

export default Message;