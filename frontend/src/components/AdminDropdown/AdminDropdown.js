import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AdminInput from 'components/AdminInput';
import './style.css';

const renderOption = (t, onClick, noTranslation) => ([key, value]) => (
  <li
    key={key}
    className="admin-dropdown__option"
    onClick={onClick}
    data-value={key}
  >
    {noTranslation ? value : t(value)}
  </li>
);

const AdminDropdown = ({ onChange, value, options, placeholder, name, label, className, integer, noTranslation }) => {
  const { t } = useTranslation();

  const innerValue = integer ? parseInt(value, 10) : value;

  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => (innerValue ? options.find(([id]) => id === innerValue) || [null, placeholder] : [null, placeholder]),
    [options, innerValue, placeholder],
  );

  const [selectedId, selectedLabel] = selectedOption;

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onChooseOption = useCallback(e => {
    const { value } = e.currentTarget.dataset;
    const innerValue = integer ? parseInt(value, 10) : value;
    onChange(name, innerValue);
    setOpen(false);
  }, [onChange, name]);

  const dropdownRef = useRef();

  useEffect(() => {
    const onClickOutside = e => {
      if (!open || !dropdownRef.current) return;
      if (e.currentTarget !== dropdownRef.current) setOpen(false); 
    }

    window.document.addEventListener('click', onClickOutside);

    return () => {
      window.document.removeEventListener('click', onClickOutside);
    };
  }, [open]);

  let optionClasses = 'admin-dropdown__options';
  if (open) optionClasses += ' admin-dropdown__options--open';

  let inputClasses = 'admin-dropdown__input';
  if (!value) inputClasses += ' admin-dropdown__input--empty';

  const iconClasses = open ? 'admin-dropdown__icon fa fa-chevron-up' : 'admin-dropdown__icon fa fa-chevron-down';

  return (
    <AdminInput wrapOnly label={label} className={className}>
      <div className="admin-dropdown" ref={dropdownRef}>
        <i className={iconClasses} />
        <div className={inputClasses} onClick={onOpen}>{t(selectedLabel)}</div>
        <ul className={optionClasses}>
          {options.map(renderOption(t, onChooseOption, noTranslation))}
        </ul>
      </div>
    </AdminInput>
  );
};

export default AdminDropdown;
