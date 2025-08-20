import { Backdrop, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

function LoadingBlocker({ open, message = "eti_loading", parentRef }) {

    const [container, setContainer] = useState();

    const {t} = useTranslation();

    useEffect(() => {
        if (parentRef?.current) {
            setContainer(parentRef.current);
        }
    }, [parentRef]);
    
    if (!open || !container) return null;

    const baseSx = {
        color: '#fff',
        top: 0,
        left: 0,
        borderRadius: 'inherit',
        gap: 2,
    };

    const sx = {
        ...baseSx,
        position: parentRef ? 'absolute' : 'fixed',
        width: parentRef ? '100%' : '100vw',
        height: parentRef ? '100%' : '100vh',
        zIndex: (theme) =>
            parentRef ? theme.zIndex.drawer + 1 : theme.zIndex.modal + 1,
    };


    return ReactDOM.createPortal(
        <Backdrop
            sx={sx}
            open={open}>
            <Typography variant="h6">{t(message)}</Typography>
            <CircularProgress color="inherit" />
        </Backdrop>, container
    );
}

LoadingBlocker.propTypes = {
    open : PropTypes.bool,
    message : PropTypes.string,
    parentRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
}

export default React.memo(LoadingBlocker);