import { useTranslation } from 'react-i18next';

const useLanguage = () => {
  const { i18n } = useTranslation();
  return i18n.language;
};

export default useLanguage;
