import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ScrollArea from 'react-scrollbar';
import Modal from 'components/Modal';
import { requestEmail } from 'store/actionCreators/email';
import './style.css';

const SendEmailModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onChangeName = useCallback(e => setName(e.currentTarget.value), []);
  const onChangeEmail = useCallback(e => setEmail(e.currentTarget.value), []);
  const onChangeMessage = useCallback(e => setMessage(e.currentTarget.value), []);

  const onConfirm = useCallback(() => {
    dispatch(requestEmail(name, email, message, onClose));
  }, [name, email, message, onClose]);

  return (
    <Modal onClose={onClose}>
      <div className="modal__box send-email__box">
        <header className="modal__header send-email__header">
          <div className="modal__title send-email__title">{t('sendEmail.title')}</div>
          <i className="fa fa-times send-email__close" onClick={onClose} />
        </header>
        <ScrollArea
          vertical
          smoothScrolling
          className="aside__scrollarea"
          contentClassName="aside__scrollable"
        >
          <div className="modal__body send-email__body">
            <div className="send-email__text">{t('sendEmail.text')}</div>
            <div className="admin-form__columns">
              <div className="admin-form__column">
                <label className="send-email__label" htmlFor="name">{t('sendEmail.name')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={onChangeName}
                  name="name"
                  className="admin-form__text send-email__input"
                />
              </div>
              <div className="admin-form__column">
                <label className="send-email__label" htmlFor="email">{t('sendEmail.email')}</label>
                <input
                  type="text"
                  value={email}
                  onChange={onChangeEmail}
                  name="email"
                  className="admin-form__text send-email__input"
                />
              </div>
            </div>
            <label className="send-email__label" htmlFor="message">{t('sendEmail.message')}</label>
            <textarea
              value={message}
              onChange={onChangeMessage}
              name="message"
              className="send-email__input send-email__textarea admin-form__textarea"
            />
          </div>
          <footer className="modal__footer send-email__footer">
            <button className="send-email__confirm" onClick={onConfirm}>
              {t('sendEmail.confirm')}
            </button>
          </footer>
        </ScrollArea>
      </div>
    </Modal>
  );
};

export default SendEmailModal;
