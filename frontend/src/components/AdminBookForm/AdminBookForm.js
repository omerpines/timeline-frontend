import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AdminPage from 'components/AdminPage';
import AdminForm from 'components/AdminForm';
import AdminFormTitle from 'components/AdminFormTitle';
import AdminDateInput from 'components/AdminDateInput';
import AdminFileInput from 'components/AdminFileInput';
import AdminDropdown from 'components/AdminDropdown';
import AdminInput from 'components/AdminInput';
import AdminFormFooter from 'components/AdminFormFooter';
import AdminRelationContainer from 'components/AdminRelationContainer';
import AdminCharacterRelation from 'components/AdminCharacterRelation';
import AdminMediaLibrary from 'components/AdminMediaLibrary';
import useForm from 'hooks/useForm';
import useLanguage from 'hooks/useLanguage';
import useAdminTab from 'hooks/useAdminTab';
import useData from 'hooks/useData';
import {
  resetBook,
  updateBook,
  requestFetchBook,
  requestAddBook,
  requestEditBook,
} from 'store/actionCreators/books';
import { bookForm } from 'store/selectors/bookForm';
import { getLocalized } from 'helpers/util';

const AdminBookForm = ({ editMode }) => {
  const { id } = useParams();
  const lang = useLanguage();

  const { periods, characters } = useData();

  const periodOptions = useMemo(() => {
    return periods.map(p => [p.id, getLocalized(p, 'name', lang)]);
  }, [periods, lang]);

  const [state, onChange, onSubmit, onChangeRelations] = useForm(
    bookForm,
    resetBook,
    updateBook,
    requestFetchBook,
    requestAddBook,
    requestEditBook,
    id,
  );

  const [showMedia, moveToForm, moveToMedia] = useAdminTab();

  const characterOptions = useMemo(() => {
    const relations = state.characters;
    const filteredCharacters = characters.filter(c => relations.indexOf(c.id) < 0);
    return filteredCharacters.map(c => [c.id, getLocalized(c, 'name', lang)]);
  }, [state.characters, characters, lang]);

  const formTitle = editMode ? 'admin.book.title.edit' : 'admin.book.title.add';

  return showMedia ? (
    <AdminMediaLibrary form="book" onBack={moveToForm} />
  ) : (
    <AdminPage>
      <AdminFormTitle title={formTitle} step={1} totalSteps={2} />
      <AdminForm>
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminInput
              type="text"
              label="admin.book.name"
              name="name"
              value={state.name}
              onChange={onChange}
            />
            <AdminDropdown
              value={state.period}
              name="period"
              onChange={onChange}
              options={periodOptions}
              label="admin.book.period"
              placeholder="admin.book.period.placeholder"
              integer
              noTranslation
            />
            <AdminDropdown
              value={null}
              name="characters"
              onChange={onChangeRelations}
              options={characterOptions}
              label="admin.book.characters"
              placeholder="admin.book.characters.placeholder"
              integer
              noTranslation
            />
            <AdminRelationContainer
              name="characters"
              ids={state.characters}
              entities={characters}
              onChange={onChange}
              component={AdminCharacterRelation}
            />
          </div>
          <div className="admin-form__column">
            <AdminDateInput onChange={onChange} state={state} />
            <AdminInput wrapOnly label="admin.book.media" className="admin-input--flex-container">
              <AdminFileInput
                name="picture"
                value={state.picture}
                onChange={onChange}
                label="admin.book.picture"
                labelInside
                className="admin-file-input--flex admin-file-input--right admin-file-input--small"
              />
              <AdminFileInput
                name="background"
                value={state.background}
                onChange={onChange}
                label="admin.book.background"
                labelInside
                className="admin-file-input--flex admin-file-input--left admin-file-input--small"
              />
            </AdminInput>
          </div>
        </div>
        <AdminInput
          type="text"
          label="admin.book.age"
          name="age"
          value={state.age}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.book.location"
          name="location"
          value={state.location}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.book.summary"
          name="summary"
          value={state.summary}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.book.content"
          name="content"
          value={state.content}
          onChange={onChange}
        />
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

export default AdminBookForm;
