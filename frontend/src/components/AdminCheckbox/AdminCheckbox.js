import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';

const AdminCheckbox = ({ label, className, checked, onChange }) => {
  const { t } = useTranslation();

  let classes = 'admin-checkbox';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes} onClick={onChange}>
      <div className="admin-checkbox__checkbox">
        {checked && <i className="fa fa-check" />}
      </div>
      <div className="admin-checkbox__label">{t(label)}</div>
    </div>
  );
};

export default AdminCheckbox;
