import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AdminPage from 'components/AdminPage';
import AdminForm from 'components/AdminForm';
import AdminFormTitle from 'components/AdminFormTitle';
import AdminDateInput from 'components/AdminDateInput';
import AdminColorInput from 'components/AdminColorInput';
import AdminInput from 'components/AdminInput';
import AdminFormFooter from 'components/AdminFormFooter';
import AdminDropdown from 'components/AdminDropdown';
import AdminCharacterRelationBlock from 'components/AdminCharacterRelationBlock';
import AdminMediaLibrary from 'components/AdminMediaLibrary';
import useForm from 'hooks/useForm';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import useAdminTab from 'hooks/useAdminTab';
import {
  resetEvent,
  updateEvent,
  requestFetchEvent,
  requestAddEvent,
  requestEditEvent,
} from 'store/actionCreators/events';
import { eventForm } from 'store/selectors/eventForm';
import { getLocalized } from 'helpers/util';

const pathOptions = [
  [1, '1'],
  [2, '2'],
  [3, '3'],
];

const AdminCharacterForm = ({ editMode }) => {
  const { id } = useParams();
  const lang = useLanguage();

  const { stories } = useData();

  const storyOptions = useMemo(() => {
    return stories.map(s => [s.id, getLocalized(s, 'name', lang)]);
  }, [stories]);

  const [state, onChange] = useForm(
    eventForm,
    resetEvent,
    updateEvent,
    requestFetchEvent,
    requestAddEvent,
    requestEditEvent,
    id,
  );
  
  const [showMedia, moveToForm, moveToMedia] = useAdminTab();

  const formTitle = editMode ? 'admin.event.title.edit' : 'admin.event.title.add';

  const chars = useMemo(() => [...state.characters, ...state.secondaryCharacters], [state]);

  return showMedia ? (
    <AdminMediaLibrary form="event" onBack={moveToForm} />
  ) : (
    <AdminPage>
      <AdminFormTitle title={formTitle} step={1} totalSteps={2} />
      <AdminForm>
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminInput
              type="text"
              label="admin.event.name"
              name="name"
              value={state.name}
              onChange={onChange}
            />
            <AdminDateInput onChange={onChange} state={state} fromOnly />
            <AdminColorInput name="color" value={state.color} onChange={onChange} />
          </div>
          <div className="admin-form__column">
            <AdminDropdown
              value={state.story}
              options={storyOptions}
              onChange={onChange}
              name="story"
              placeholder="admin.storyRelation"
              label="admin.storyRelation.placeholder"
              integer
              noTranslation
            />
            <AdminDropdown
              value={state.path}
              options={pathOptions}
              onChange={onChange}
              name="path"
              placeholder="admin.story.path"
              label="admin.story.path.placeholder"
              integer
            />
          </div>
        </div>
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminCharacterRelationBlock
              name="characters"
              value={state.characters}
              onChange={onChange}
              currentId=""
              idsOnly
              excluded={chars}
            />
          </div>
          <div className="admin-form__column">
            <AdminCharacterRelationBlock
              name="secondaryCharacters"
              value={state.secondaryCharacters}
              onChange={onChange}
              currentId=""
              idsOnly
              label="admin.story.secondaryCharacters"
              placeholder="admin.story.secondaryCharacters.placeholder"
              excluded={chars}
            />
          </div>
        </div>
        <AdminInput
          type="text"
          label="admin.quotesource"
          name="quotesource"
          value={state.quotesource}
          onChange={onChange}
        />
        <AdminInput
          type="text"
          label="admin.event.quote"
          name="quote"
          value={state.quote}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.event.summary"
          name="summary"
          value={state.summary}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.event.location"
          name="location"
          value={state.location}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.event.references"
          name="references"
          value={state.references}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.forMoreInformation"
          name="links"
          value={state.links}
          onChange={onChange}
        />
        <AdminFormFooter onSubmit={moveToMedia} disableSubmit={state.fromDate === null || !state.name} />
      </AdminForm>
    </AdminPage>
  );
};

export default AdminCharacterForm;
