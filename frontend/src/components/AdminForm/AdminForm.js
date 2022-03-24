import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';

const AdminForm = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="admin-form">
      <header className="admin-form__header">{t('admin.form.header')}</header>
      {children}
    </div>
  );
};

export default AdminForm;
