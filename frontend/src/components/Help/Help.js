import React, { useState, useCallback } from 'react';
import SendEmailModal from 'components/SendEmailModal';
import './style.css';
import icon from './icon.png';

const style = { backgroundImage: `url(${icon})` };

const Help = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = useCallback(() => setShowModal(s => !s), []);

  return (
    <React.Fragment>
      <div className="help" style={style} onClick={toggleShowModal} />
      {showModal && <SendEmailModal onClose={toggleShowModal} />}
    </React.Fragment>
  );
};

export default Help;
