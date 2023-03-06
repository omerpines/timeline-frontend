import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './style.css';

const AdminFormFooter = ({ onSubmit, onCancel, disableSubmit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onCancelInner = useCallback(() => {
    navigate(-1);
  }, []);

  return (
    <footer className="admin-form-footer">
      <button className="admin-form-footer__button admin-form-footer__cancel" onClick={onCancel || onCancelInner}>
        {t('admin.cancel')}
      </button>
      <button className="admin-form-footer__button admin-form-footer__save" onClick={onSubmit} disabled={disableSubmit}>
        {t('admin.saveAndContinue')}
      </button>
    </footer>
  );
};

export default AdminFormFooter;
