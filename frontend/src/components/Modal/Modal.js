import React, { useCallback } from 'react';
import './style.css';

const Modal = ({ children, onClose, stopScrollPropagation }) => {
  const onStopScroll = useCallback(e => {
    e.stopPropagation();
    return false;
  }, []);

  const onwheel = stopScrollPropagation ? onStopScroll : undefined;

  return (
    <div className="modal" onWheel={onwheel}>
      <div className="modal__shadow" onClick={onClose} />
      <div className="modal__content">
        {children}
      </div>
    </div>
  );
};

export default Modal;
