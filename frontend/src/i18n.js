import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import he from 'locales/he';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'he',
    lng: 'he',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ['he'],
    resources: { he },
  });

export default i18n;
