import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import { requestAuthentication } from 'store/actionCreators/authentication';
import { isAuthenticationLoading, isAuthenticated } from 'store/selectors/authentication';
import './style.css';

const AuthModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(isAuthenticationLoading);
  const authenticated = useSelector(isAuthenticated);

  const authenticationDisabled = loading || !username || !password;

  const onChangeUsername = useCallback(e => {
    setUsername(e.target.value);
  }, []);

  const onChangePassword = useCallback(e => {
    setPassword(e.target.value);
  }, []);

  const onAuthenticate = useCallback(() => {
    dispatch(requestAuthentication(username, password));
  }, [dispatch, username, password]);

  useEffect(() => {
    if (!authenticated) return;
    onClose();
    navigate('/admin');
  }, [navigate, authenticated, onClose]);

  if (authenticated) return false;

  return (
    <Modal onClose={onClose}>
      <div className="modal__box auth__box">
        <div className="modal__body auth__body">
          <input
            type="text"
            className="auth__username auth__input admin-form__text"
            value={username}
            placeholder={t('auth.username')}
            onChange={onChangeUsername}
          />
          <input
            type="password"
            className="auth__password auth__input admin-form__text"
            value={password}
            placeholder={t('auth.password')}
            onChange={onChangePassword}
          />
        </div>
        <footer className="modal__footer auth__footer">
          <button className="auth__confirm-button" onClick={onAuthenticate} disabled={authenticationDisabled}>
            {t('auth.login')}
          </button>
        </footer>
      </div>
    </Modal>
  );
};

export default AuthModal;
