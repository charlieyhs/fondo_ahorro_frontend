import PropTypes from "prop-types";
import LanguageSelector from "../components/Lists/LanguageSelector";
import { useTranslation } from "react-i18next";

const GeneralLayout = ({children}) => {

    const {t} = useTranslation();

    return(
        <div className="layout-container">
            <header>
                <LanguageSelector />
            </header>

            <main>
                {children}
            </main>

            <footer>
                <h2>{t('footer.powered_by')} Charlieyhs</h2>
            </footer>
        </div>
    );
}

GeneralLayout.propTypes = {
    children : PropTypes.node.isRequired
}

export default GeneralLayout;