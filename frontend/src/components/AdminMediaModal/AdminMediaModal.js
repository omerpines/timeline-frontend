import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; 
import Modal from 'components/Modal';
import ModalTabs from 'components/ModalTabs';
import ScrollArea from 'react-scrollbar/dist/no-css';
import { v4 as uuid } from 'uuid';
import { getYoutubeId } from 'helpers/util';
import './style.css';

const emptyList = [];

const tabOptions = [
  ['viaLink', 'mediaModal.viaLink'],
  ['viaUpload', 'mediaModal.viaUpload'],
];

const renderLink = onDelete => link => (
  <div className="media-modal__link" key={link}>
  <div className="media-modal__link-hyper">{link}</div>
    <i className="fa fa-times media-modal__delete-link" onClick={onDelete} data-id={link} />
  </div>
);

const AdminMediaModal = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  const [tab, setTab] = useState('viaLink');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState(emptyList);

  const onChangeLink = useCallback(e => {
    setLink(e.currentTarget.value);
  }, []);

  const onAddLink = useCallback(() => {
    setLinks(ls => [...ls, link]);
    setLink('');
  }, [link]);

  const onDeleteLink = useCallback(e => {
    const { id } = e.currentTarget.dataset;
    setLinks(ls => ls.filter(l => l !== id));
  }, []);

  const onSubmitInner = useCallback(() => {
    const objectLinks = links.map(link => {
      const isYoutube = link.includes('youtu.be');
      if (isYoutube) return {
        id: uuid(),
        type: 'youtube',
        youtubeId: getYoutubeId(link),
        title: '',
        description: '',
      };
      
      return {
        id: uuid(),
        type: 'image',
        url: link,
        title: '',
        description: '',
      };
    });
    onSubmit(objectLinks);
  }, [links, onSubmit]);

  return (
    <Modal onClose={onClose}>
      <div className="modal__box media-modal__box">
        <header className="modal__header media-modal__header">
          <div className="modal__title media-modal__title">{t('mediaModal.title')}</div>
          <ModalTabs options={tabOptions} value={tab} onChange={setTab} />
        </header>
        {tab === 'viaLink' && (
          <div className="modal__body media-modal__body">
            <div className="media-modal__via-link">
              <input
                type="text"
                className="admin-form__text media-modal__link-input"
                onChange={onChangeLink}
                placeholder={t('mediaModal.addLink.placeholder')}
                value={link}
              />
              <button className="media-modal__add-link-button" onClick={onAddLink}>{t('mediaModal.addLink')}</button>
            </div>
            <ScrollArea
              vertical
              smoothScrolling
              className="aside__scrollarea media-modal__links"
              contentClassName="aside__scrollable media-modal__links-content"
            >
              {links.map(renderLink(onDeleteLink))}
            </ScrollArea>
          </div>
        )}
        <footer className="modal__footer media-modal__footer">
          <button className="media-modal__submit-button" onClick={onSubmitInner}>
            {t('mediaModal.submit')}
          </button>
        </footer>
      </div>
    </Modal>
  );
};

export default AdminMediaModal;
