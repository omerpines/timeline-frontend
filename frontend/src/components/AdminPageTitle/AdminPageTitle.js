import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './style.css';

const AdminPageTitle = ({ addTo, title, addTitle, onClickAdd }) => {
  const { t } = useTranslation();

  return (
    <header className="admin-page-title">
      <div className="admin-page-title__title">{t(title)}</div>
      <Link className="admin-page-title__add" to={addTo || '#'} onClick={onClickAdd}>
        <span className="admin-page-title__add-icon">+</span>
        <span className="admin-page-title__add-text">{t(addTitle)}</span>
      </Link>
    </header>
  );
};

export default AdminPageTitle;
