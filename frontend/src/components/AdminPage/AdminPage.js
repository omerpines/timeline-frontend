import React from 'react';
import './style.css';

const AdminPage = ({ children }) => {
  return (
    <div className="admin-page">
      {children}
    </div>
  );
};

export default AdminPage;
