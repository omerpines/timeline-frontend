import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import AdminInput from 'components/AdminInput';
import AdminFileInput from 'components/AdminFileInput';
import { requestAddProfession } from 'store/actionCreators/professions';
import './style.css';

const AdminAddProfessionModal = ({ onClose, initialValue }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [value, setValue] = useState(initialValue);
  const [icon, setIcon] = useState(null);

  const onChange = useCallback((name, value) => {
    setValue(value);
  }, []);

  const onChangeIcon = useCallback((name, value) => {
    setIcon(value);
  }, []);

  const onSubmit = useCallback(() => {
    dispatch(requestAddProfession({
      icon,
      name: value,
    }));
    onClose();
  }, [value, icon, onClose]);

  return (
    <Modal onClose={onClose}>
      <div className="modal__box add-profession__box">
        <header className="modal__header add-profession__header">
          <div className="modal__title add-profession__title">{t('addProfessionModal.title')}</div>
          <i className="fa fa-times add-profession__close" onClick={onClose} />
        </header>
        <div className="modal__body add-profession__body">
          <div className="add-profession__caption">{t('addProfessionModal.caption')}</div>
          <div className="add-profession__form">
            <AdminInput
              type="text"
              label="addProfessionModal.inputTitle"
              name="name"
              value={value}
              onChange={onChange}
            />
            <AdminFileInput
              label="addProfessionModal.iconInputTitle"
              value={icon}
              onChange={onChangeIcon}
              name="icon"
              className="add-profession__icon-input"
            />
          </div>
        </div>
        <footer className="modal__footer add-profession__footer">
          <button className="add-profession__cancel" onClick={onClose}>{t('addProfessionModal.cancel')}</button>
          <button className="add-profession__confirm" onClick={onSubmit}>{t('addProfessionModal.confirm')}</button>
        </footer>
      </div>
    </Modal>
  );
};

export default AdminAddProfessionModal;
