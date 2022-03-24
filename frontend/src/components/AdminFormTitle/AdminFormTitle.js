import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';

const AdminFormTitle = ({ title, step, totalSteps }) => {
  const { t } = useTranslation();

  return (
    <header className="admin-form-title">
      <div className="admin-form-title__title">{t(title)}</div>
      <div className="admin-form-title__step">{t('admin.step', { step, total: totalSteps })}</div>
    </header>
  );
};

export default AdminFormTitle;