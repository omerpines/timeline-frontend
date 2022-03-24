import React from 'react';
import './style.css';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal">
      <div className="modal__shadow" onClick={onClose} />
      <div className="modal__content">
        {children}
      </div>
    </div>
  );
};

export default Modal;
