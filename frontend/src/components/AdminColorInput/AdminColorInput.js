import React, { useState, useCallback, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import AdminInput from 'components/AdminInput';
import './style.css';

const AdminColorInput = ({ onChange, value, name }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onClickInput = useCallback(() => {
    setShowPicker(sp => !sp);
  }, []);

  const onChangeInput = useCallback((e) => {
    onChange(name, e.currentTarget.value);
  }, [name, onChange]);

  const onChangePicker = useCallback(val => {
    onChange(name, val.hex);
  }, [name]);

  useEffect(() => {
    if (!value) onChange(name, '#ffffff');
  }, []);

  return (
    <AdminInput type="text" label="admin.color" className="admin-form__color" wrapOnly>
      <input
        type="text"
        className="admin-form__text"
        placeholder="admin.color.placeholder"
        value={value}
        onClick={onClickInput}
        onChange={onChangeInput}
      />
      {showPicker && (
        <SketchPicker
          color={value || '#ffffff'}
          onChange={onChangePicker}
        />
      )}
    </AdminInput>
  );
};

export default AdminColorInput;
