import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import de from './locales/de.json';

const saved =
  (typeof localStorage !== 'undefined' && localStorage.getItem('bgh-lang')) || 'en';
const lng = saved === 'de' ? 'de' : 'en';

if (typeof document !== 'undefined') {
  document.documentElement.lang = lng;
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
