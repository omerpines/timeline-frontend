import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';

const renderHeader = t => (h, i) => (
  <th className="admin-table__header" key={i}>{h && t(h)}</th>
);

const AdminTable = ({ children, headers }) => {
  const { t } = useTranslation();

  return (
    <div className="admin-table">
      <table className="admin-table__table">
        <thead>
          <tr>
            {headers.map(renderHeader(t))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
