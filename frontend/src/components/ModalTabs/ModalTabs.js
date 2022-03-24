import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';

const renderOption = (t, onClick, currentId) => ([id, value]) => {
  let classes = 'modal-tabs__tab';
  if (currentId === id) classes += ' modal-tabs__tab--selected';

  return (
    <li className={classes} onClick={onClick} key={id} data-id={id}>{t(value)}</li>
  );
};

const ModalTabs = ({ options, value, onChange }) => {
  const { t } = useTranslation();

  const onClick = useCallback(e => {
    const { id } = e.currentTarget.dataset;
    onChange(id);
  }, [onChange]);

  return (
    <ul className="modal-tabs">
      {options.map(renderOption(t, onClick, value))}
    </ul>
  );
};

export default ModalTabs;
