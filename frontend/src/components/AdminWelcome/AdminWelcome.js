import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getUserData } from 'store/selectors/authentication';
import './style.css';

const AdminWelcome = () => {
  const { t } = useTranslation();
  const data = useSelector(getUserData);

  return (
    <div className="admin-welcome">
      <div className="admin-welcome__hello">{t('admin.hello')}</div>
      <div className="admin-welcome__name">{data.username}</div>
    </div>
  );
};

export default AdminWelcome;
