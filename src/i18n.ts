import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import EN from './Languages/EN.json';
import RU from './Languages/RU.json';
import ES from './Languages/ES.json';
import DE from './Languages/DE.json';
import FR from './Languages/FR.json';
import UA from './Languages/UA.json';

const resources = {
    en: { translation: EN },
    ru: { translation: RU },
    es: { translation: ES },
    de: { translation: DE },
    fr: { translation: FR },
    ua: { translation: UA },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;