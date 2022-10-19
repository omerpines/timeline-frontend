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
import AdminRelationContainer from 'components/AdminRelationContainer';
import AdminCharacterRelation from 'components/AdminCharacterRelation';
import AdminMediaLibrary from 'components/AdminMediaLibrary';
import useForm from 'hooks/useForm';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import useAdminTab from 'hooks/useAdminTab';
import {
  resetStory,
  updateStory,
  requestFetchStory,
  requestAddStory,
  requestEditStory,
} from 'store/actionCreators/stories';
import { storyForm } from 'store/selectors/storyForm';
import { getLocalized } from 'helpers/util';

const pathOptions = [
  [1, '1'],
  [2, '2'],
  [3, '3'],
];

const AdminStoryForm = ({ editMode }) => {
  const lang = useLanguage();
  const { id } = useParams();

  const [state, onChange, onSubmit, onChangeRelations] = useForm(
    storyForm,
    resetStory,
    updateStory,
    requestFetchStory,
    requestAddStory,
    requestEditStory,
    id,
  );

  const [showMedia, moveToForm, moveToMedia] = useAdminTab();

  const { characters, books } = useData();

  const bookOptions = useMemo(() => {
    return books.map(b => [b.id, getLocalized(b, 'name', lang)]);
  }, [books, lang]);

  const characterOptions = useMemo(() => {
    const relations = [...state.characters, ...state.secondaryCharacters];
    const filteredCharacters = characters.filter(c => relations.indexOf(c.id) < 0);
    return filteredCharacters.map(c => [c.id, getLocalized(c, 'name', lang)]);
  }, [state.characters, state.secondaryCharacters, characters, lang]);

  const secondaryCharacterOptions = useMemo(() => {
    const relations = [...state.characters, ...state.secondaryCharacters];
    const filteredCharacters = characters.filter(c => relations.indexOf(c.id) < 0);
    return filteredCharacters.map(c => [c.id, getLocalized(c, 'name', lang)]);
  }, [state.characters, state.secondaryCharacters, characters, lang]);

  const formTitle = editMode ? 'admin.story.title.edit' : 'admin.story.title.add';

  return showMedia ? (
    <AdminMediaLibrary form="story" onBack={moveToForm} />
  ) : (
    <AdminPage>
      <AdminFormTitle title={formTitle} step={1} totalSteps={2} />
      <AdminForm>
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminInput
              type="text"
              label="admin.story.name"
              name="name"
              value={state.name}
              onChange={onChange}
            />
            <AdminDropdown
              value={state.book}
              options={bookOptions}
              onChange={onChange}
              name="book"
              placeholder="admin.bookRelation.placeholder"
              label="admin.bookRelation"
              integer
            />
          </div>
          <div className="admin-form__column">
            <AdminDateInput onChange={onChange} state={state} />
            <AdminInput
              type="text"
              label="admin.story.age"
              name="age"
              value={state.age}
              onChange={onChange}
            />
          </div>
        </div>
        <AdminInput
          type="textarea"
          label="admin.story.summary"
          name="summary"
          value={state.summary}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.story.plot"
          name="plot"
          value={state.plot}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.story.references"
          name="references"
          value={state.references}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.story.location"
          name="location"
          value={state.location}
          onChange={onChange}
        />
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminDropdown
              value={state.characters}
              options={characterOptions}
              onChange={onChangeRelations}
              name="characters"
              placeholder="admin.story.characters"
              label="admin.story.characters.placeholder"
              integer
            />
            <AdminRelationContainer
              name="characters"
              ids={state.characters}
              entities={characters}
              component={AdminCharacterRelation}
              onChange={onChange}
            />
          </div>
          <div className="admin-form__column">
            <AdminDropdown
              value={state.secondaryCharacters}
              options={secondaryCharacterOptions}
              onChange={onChangeRelations}
              name="secondaryCharacters"
              placeholder="admin.story.secondaryCharacters"
              label="admin.story.secondaryCharacters.placeholder"
              integer
            />
            <AdminRelationContainer
              name="secondaryCharacters"
              ids={state.secondaryCharacters}
              entities={characters}
              component={AdminCharacterRelation}
              onChange={onChange}
            />
          </div>
        </div>
        <AdminInput
          type="textarea"
          label="admin.forMoreInformation"
          name="links"
          value={state.links}
          onChange={onChange}
        />
        <AdminFormFooter onSubmit={moveToMedia} disableSubmit={state.fromDate === null || state.endDate === null || !state.name} />
      </AdminForm>
    </AdminPage>
  );
};

export default AdminStoryForm;
