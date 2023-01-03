import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; 
import ScrollArea from 'react-scrollbar/dist/no-css';
import Modal from 'components/Modal';
import ModalTabs from 'components/ModalTabs';
import AdminFileInput from 'components/AdminFileInput';
import { v4 as uuid } from 'uuid';
import { getYoutubeId, isYoutubeUrl, getFileUrl, isAudioFormatSupported, isImgFormatSupported } from 'helpers/util';
import './style.css';

const emptyList = [];

const tabOptions = [
  ['viaUpload', 'mediaModal.viaUpload'],
  ['viaLink', 'mediaModal.viaLink'],
];

const renderLink = onDelete => link => (
  <div className="media-modal__link" key={link}>
    <div className="media-modal__link-hyper">{link}</div>
    <i className="fa fa-times media-modal__delete-link" onClick={onDelete} data-id={link} />
  </div>
);

const renderUpload = onDelete => upload => (
  <div className="media-modal__upload" key={upload.name}>
    <div className="media-modal__upload-name">{upload.name}</div>
    <i className="fa fa-times media-modal__delete-upload" onClick={onDelete} data-name={upload.name} />
  </div>
);

const AdminMediaModal = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  const [tab, setTab] = useState('viaLink');
  const [link, setLink] = useState('');
  const [links, setLinks] = useState(emptyList);
  const [uploads, setUploads] = useState(emptyList);

  const onChangeLink = useCallback(e => {
    setLink(e.currentTarget.value);
  }, []);

  const onChangeUploadFile = useCallback((name, file) => {
    if (!file || !file.name) return;

    setUploads(u => [...u, file]);
  }, []);

  const onAddLink = useCallback(() => {
    if (!link) return;
    setLinks(ls => [...ls, link]);
    setLink('');
  }, [link]);

  const onDeleteLink = useCallback(e => {
    const { id } = e.currentTarget.dataset;
    setLinks(ls => ls.filter(l => l !== id));
  }, []);

  const onDeleteUpload = useCallback(e => {
    const { name } = e.currentTarget.dataset;
    setUploads(us => us.filter(u => u.name !== name));
  }, []);

  const onSubmitInner = useCallback(() => {
    const objectLinks = links.map(link => {
      const isYoutube = isYoutubeUrl(link);
      const isImg = isImgFormatSupported(link);
      const isAudio = isAudioFormatSupported(link);
      if (isYoutube) return {
        id: uuid(),
        type: 'youtube',
        youtubeId: getYoutubeId(link),
        title: '',
        description: '',
      };

      if (isAudio) return {
        id: uuid(),
        type: 'audio',
        url: link,
        title: '',
        description: '',
      };
      
      if (isImg) return {
        id: uuid(),
        type: 'image',
        url: link,
        title: '',
        description: '',
      };

      return false;
    }).filter(o => o);

    const objectUploads = uploads.map(upload => {
      const [type] = upload.type.split('/');
      if (type === 'video') return {
        id: uuid(),
        type: 'newVideo',
        file: upload,
        title: '',
        description: '',
        url: getFileUrl(upload),
      };

      if (type === 'audio') return {
        id: uuid(),
        type: 'newAudio',
        file: upload,
        title: '',
        description: '',
        url: getFileUrl(upload),
      };

      return {
        id: uuid(),
        type: 'newImage',
        file: upload,
        title: '',
        description: '',
        url: getFileUrl(upload),
      };
    });
    onSubmit([...objectUploads, ...objectLinks]);
  }, [uploads, links, onSubmit]);

  return (
    <Modal onClose={onClose}>
      <div className="modal__box media-modal__box">
        <header className="modal__header media-modal__header">
          <div className="modal__title media-modal__title">{t('mediaModal.title')}</div>
          <ModalTabs options={tabOptions} value={tab} onChange={setTab} />
        </header>
        {tab === 'viaUpload' && (
          <div className="modal__body media-modal__body">
            <div className="media-modal__via-upload">
              <div className="admin-form__columns">
                <div className="admin-form__column">
                  <AdminFileInput
                    name="newFile"
                    noLabel
                    onChange={onChangeUploadFile}
                    className="media-modal__file-input"
                  />
                </div>
                <div className="admin-form__column">
                  <ScrollArea
                    vertical
                    smoothScrolling
                    className="aside__scrollarea media-modal__uploads"
                    contentClassName="aside__scrollable media-modal__uploads-content"
                  >
                    {uploads.map(renderUpload(onDeleteUpload))}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        )}
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
