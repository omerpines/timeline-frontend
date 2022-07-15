import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import AdminPage from 'components/AdminPage';
import AdminFormTitle from 'components/AdminFormTitle';
import AdminPageTitle from 'components/AdminPageTitle';
import AdminFormFooter from 'components/AdminFormFooter';
import AdminMediaModal from 'components/AdminMediaModal';
import useForm from 'hooks/useForm';
import {
  requestAddBook,
  requestEditBook,
  requestFetchBook,
  resetBook,
  updateBook,
} from 'store/actionCreators/books';
import {
  requestAddCharacter,
  requestEditCharacter,
  requestFetchCharacter,
  resetCharacter,
  updateCharacter,
} from 'store/actionCreators/characters';
import {
  requestAddEvent,
  requestEditEvent,
  requestFetchEvent,
  resetEvent,
  updateEvent,
} from 'store/actionCreators/events';
import {
  requestAddPeriod,
  requestEditPeriod,
  requestFetchPeriod,
  resetPeriod,
  updatePeriod,
} from 'store/actionCreators/periods';
import {
  requestAddStory,
  requestEditStory,
  requestFetchStory,
  resetStory,
  updateStory,
} from 'store/actionCreators/stories';
import { bookForm } from 'store/selectors/bookForm';
import { characterForm } from 'store/selectors/characterForm';
import { eventForm } from 'store/selectors/eventForm';
import { periodForm } from 'store/selectors/periodForm';
import { storyForm } from 'store/selectors/storyForm';
import './style.css';

const youtubeOpts = {
  height: '241',
  width: '375',
};

const useFormParams = {
  period: [
    periodForm,
    resetPeriod,
    updatePeriod,
    requestFetchPeriod,
    requestAddPeriod,
    requestEditPeriod,
  ],
  book: [
    bookForm,
    resetBook,
    updateBook,
    requestFetchBook,
    requestAddBook,
    requestEditBook,
  ],
  story: [
    storyForm,
    resetStory,
    updateStory,
    requestFetchStory,
    requestAddStory,
    requestEditStory,
  ],
  event: [
    eventForm,
    resetEvent,
    updateEvent,
    requestFetchEvent,
    requestAddEvent,
    requestEditEvent,
  ],
  character: [
    characterForm,
    resetCharacter,
    updateCharacter,
    requestFetchCharacter,
    requestAddCharacter,
    requestEditCharacter,
  ],
};

const titles = {
  period: 'admin.period.title.edit',
  book: 'admin.book.title.edit',
  story: 'admin.story.title.edit',
  event: 'admin.event.title.edit',
  character: 'admin.character.title.edit',
};

const renderImage = media => (
  <img className="admin-media__image" src={media.url} key={media.id} />
);

const renderVideo = media => (
  <video className="admin-media__video" src={media.url} controls key={media.id} />
);

const renderAudio = media => (
  <audio className="admin-media__audio" src={media.url} controls key={media.id} />
);

const renderYoutube = media => (
  <YouTube key={media.id} videoId={media.youtubeId} opts={youtubeOpts} />
);

const renderNewImage = media => {
  const style = { backgroundImage: `url(${media.url})` };
  return (
    <div className="admin-media__image admin-media__new-image" style={style} key={media.id} />
  );
};

const renderNewVideo = media => {
  return (
    <video className="admin-media__video admin-media__new-video" src={media.url} controls key={media.id} />
  );
};

const renderNewAudio = media => {
  return (
    <audio className="admin-media__audio admin-media__new-audio" src={media.url} controls key={media.id} />
  );
};

const renderMedia = (t, onDelete, onChangeTitle, onChangeDescription) => media => {
  let thumb = null;
  if      (media.type === 'image')    thumb = renderImage(media);
  else if (media.type === 'video')    thumb = renderVideo(media);
  else if (media.type === 'audio')    thumb = renderAudio(media);
  else if (media.type === 'youtube')  thumb = renderYoutube(media);
  else if (media.type === 'newImage') thumb = renderNewImage(media);
  else if (media.type === 'newVideo') thumb = renderNewVideo(media);
  else if (media.type === 'newAudio') thumb = renderNewAudio(media);

  return (
    <li className="admin-media__media" key={media.id}>
      <div className="admin-media__thumbnail">
        {thumb}
        <i className="fa fa-trash-o admin-media__delete" onClick={onDelete} data-id={media.id} />
      </div>
      <input
        type="text"
        className="admin-media__media-title"
        value={media.title}
        onChange={onChangeTitle}
        placeholder={t('admin.media.title')}
        data-id={media.id}
      />
      <textarea
        className="admin-media__media-description"
        value={media.description}
        onChange={onChangeDescription}
        placeholder={t('admin.media.description')}
        data-id={media.id}
      />
      <footer className="admin-media__media-footer" />
    </li>
  );
};

const AdminMediaLibrary = ({ form, onBack }) => {
  const { id } = useParams();
  const { t } = useTranslation();

  const [state, onChange, onSubmit] = useForm(...useFormParams[form], id, true);
  const { media } = state;

  const [showModal, setShowModal] = useState(false);

  const onClickAdd = useCallback(() => {
    setShowModal(true);
  }, []);

  const onCloseAdd = useCallback(() => {
    setShowModal(false);
  }, []);

  const onSubmitAdd = useCallback(objects => {
    onChange('media', [...media, ...objects]);
    setShowModal(false);
  }, [media, onChange]);

  const onDelete = useCallback(e => {
    const { id } = e.currentTarget.dataset;
    onChange('media', media.filter(m => m.id !== id));
  }, [onChange, media]);

  const onChangeTitle = useCallback(e => {
    const { id } = e.currentTarget.dataset;
    const newMedia = media.map(m => (m.id === id ? { ...m, title: e.currentTarget.value } : m));
    onChange('media', newMedia);
  }, [onChange, media]);

  const onChangeDescription = useCallback(e => {
    if (!e.currentTarget) return;
    const { id } = e.currentTarget.dataset;
    const newMedia = media.map(m => (m.id === id ? { ...m, description: e.currentTarget.value } : m));
    onChange('media', newMedia);
  }, [onChange, media]);

  return (
    <React.Fragment>
      <AdminPage>
        <AdminFormTitle title={titles[form]} step={2} totalSteps={2} />
        <div className="admin-form admin-media">
          <AdminPageTitle
            title="admin.title.media"
            addTitle="admin.add.media"
            onClickAdd={onClickAdd}
            className="admin-page-title--gallery"
          />
          <ul className="admin-media__medias">
            {media.map(renderMedia(t, onDelete, onChangeTitle, onChangeDescription))}
          </ul>
          <AdminFormFooter onSubmit={onSubmit} onCancel={onBack} />
        </div>
      </AdminPage>
      {showModal && <AdminMediaModal onClose={onCloseAdd} onSubmit={onSubmitAdd} />}
    </React.Fragment>
  );
};

export default AdminMediaLibrary;
