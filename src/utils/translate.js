import translate from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translationEnglish from '../locales/english/translations.json'
import translationSpanish from '../locales/spanish/translations.json'

translate
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {translation : translationEnglish},
            es: {translation : translationSpanish}
        },
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        }
    });

export default translate;