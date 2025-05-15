import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";

export const LanguageProvider = ({children}) => {
    const [language, setLanguage] = useState('es');

    const contextValue = useMemo(() => ({
        language,
        setLanguage
    }),[language]);

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children : PropTypes.node.isRequired
}