import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'components/Modal';
import './style.css';

const AdminDeleteModal = ({ onConfirm, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <div className="modal__box admin-delete__box">
        <header className="modal__header admin-delete__header">
          <i className="fa fa-times admin-delete__close" onClick={onClose} />
        </header>
        <div className="modal__body admin-delete__body">
          {t('admin.delete.text')}
        </div>
        <footer className="modal__footer admin-delete__footer">
          <button className="admin-delete__cancel" onClick={onClose}>
            {t('admin.delete.cancel')}
          </button>
          <button className="admin-delete__confirm" onClick={onConfirm}>
            {t('admin.delete.confirm')}
          </button>
        </footer>
      </div>
    </Modal>
  );
};

export default AdminDeleteModal;
