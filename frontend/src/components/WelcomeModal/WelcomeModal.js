import React from 'react';
import { useTranslation } from 'react-i18next'; 
import Modal from 'components/Modal';
import config from 'constants/config';
import './style.css';

const WelcomeModal = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <div className="modal__box welcome__box">
        <header className="modal__header welcome__header">
          <div className="modal__title welcome__title">{t('welcome.title')}</div>
        </header>
        <div className="modal__body welcome__body">
          <div className="welcome__text">{t('welcome.text')}</div>
          <a className="welcome__link" href={`mailto:${config.EMAIL}`}>
            {config.EMAIL}
          </a>
        </div>
        <footer className="modal__footer welcome__footer">
          <button className="welcome__close-button" onClick={onClose}>
            {t('welcome.continue')}
          </button>
        </footer>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
