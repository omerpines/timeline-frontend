import React, { useState, useCallback } from 'react';
import AuthModal from 'components/AuthModal';
import './style.css';

const useAuthModal = () => {
  const [show, setShow] = useState(false);

  const onOpen = useCallback(() => {
    setShow(true);
  }, []);

  const onClose = useCallback(() => {
    setShow(false);
  }, []);

  return [onOpen, onClose, show];
};

const Logo = () => {
  const [onOpen, onClose, isVisible] = useAuthModal();

  return (
    <React.Fragment>
      <div className="logo" onClick={onOpen}>
        <img className="logo__image" src="/logo.png" />
      </div>
      {isVisible && <AuthModal onClose={onClose} />}
    </React.Fragment>
  );
};

export default Logo;
