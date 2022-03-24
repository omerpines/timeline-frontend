import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminPanel from 'components/AdminPanel';
import { isAuthenticated } from 'store/selectors/authentication';

const SecuredPart = () => {
  const navigate = useNavigate();
  const authenticated = useSelector(isAuthenticated);

  useEffect(() => {
    if (!authenticated) navigate('/');
  }, [navigate, authenticated]);

  if (!authenticated) return false;

  return (
    <AdminPanel />
  );
};

export default SecuredPart;
