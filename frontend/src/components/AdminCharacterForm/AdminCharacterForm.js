import React from 'react';
import { useParams } from 'react-router-dom';
import AdminPage from 'components/AdminPage';
import AdminForm from 'components/AdminForm';
import AdminFormTitle from 'components/AdminFormTitle';
import AdminFileInput from 'components/AdminFileInput';
import AdminDateInput from 'components/AdminDateInput';
import AdminInput from 'components/AdminInput';
import AdminFormFooter from 'components/AdminFormFooter';
import AdminDropdown from 'components/AdminDropdown';
import AdminCharacterRelationBlock from 'components/AdminCharacterRelationBlock';
import AdminMediaLibrary from 'components/AdminMediaLibrary';
import useForm from 'hooks/useForm';
import useAdminTab from 'hooks/useAdminTab';
import {
  resetCharacter,
  updateCharacter,
  requestFetchCharacter,
  requestAddCharacter,
  requestEditCharacter,
} from 'store/actionCreators/characters';
import { characterForm } from 'store/selectors/characterForm';
import './style.css';

const genderOptions = [
  ['male', 'admin.gender.male'],
  ['female', 'admin.gender.female'],
];

const AdminCharacterForm = ({ editMode }) => {
  const { id } = useParams();
  const pid = parseInt(id, 10);

  const [state, onChange] = useForm(
    characterForm,
    resetCharacter,
    updateCharacter,
    requestFetchCharacter,
    requestAddCharacter,
    requestEditCharacter,
    id,
  );

  const [showMedia, moveToForm, moveToMedia] = useAdminTab();

  const formTitle = editMode ? 'admin.character.title.edit' : 'admin.character.title.add';

  return showMedia ? (
    <AdminMediaLibrary form="character" onBack={moveToForm} />
  ) : (
    <AdminPage>
      <AdminFormTitle title={formTitle} step={1} totalSteps={2} />
      <AdminForm>
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminInput
              type="text"
              label="admin.character.name"
              name="name"
              value={state.name}
              onChange={onChange}
            />
            <AdminDateInput onChange={onChange} state={state} />
            <AdminDropdown
              value={state.gender}
              options={genderOptions}
              onChange={onChange}
              name="gender"
              placeholder="admin.gender.placeholder"
              label="admin.gender"
            />
          </div>
          <div className="admin-form__column">
            <AdminInput
              type="text"
              label="admin.character.attribution"
              name="attribution"
              value={state.attribution}
              onChange={onChange}
            />
            <AdminInput
              type="text"
              label="admin.character.area"
              name="area"
              value={state.area}
              onChange={onChange}
            />
          </div>
        </div>
        <AdminInput type="text" label="admin.character.role" name="role" value={state.role} onChange={onChange} />
        <AdminInput type="text" label="admin.character.nation" name="nation" value={state.nation} onChange={onChange} />
        <AdminInput
          type="text"
          label="admin.tags"
          name="tags"
          value={state.tags}
          onChange={onChange}
        />
        <div className="admin-form__columns admin-character-form__mb">
          <div className="admin-form__column">
            <AdminCharacterRelationBlock
              name="characters"
              value={state.characters}
              onChange={onChange}
              currentId={pid}
            />
          </div>
          <div className="admin-form__column">
            <AdminFileInput
              label="admin.character.image"
              value={state.image}
              onChange={onChange}
              name="image"
            />
          </div>
        </div>
        <AdminInput
          type="text"
          label="admin.shortDescription"
          name="shortDescription"
          value={state.shortDescription}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.character.summary"
          name="summary"
          value={state.summary}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.character.content"
          name="content"
          value={state.content}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.character.biography"
          name="biography"
          value={state.biography}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.character.appearances"
          name="appearances"
          value={state.appearances}
          onChange={onChange}
        />
        <AdminInput
          type="text"
          label="admin.quotesource"
          name="quotesource"
          value={state.quotesource}
          onChange={onChange}
        />
        <AdminInput
          type="text"
          label="admin.character.quote"
          name="quote"
          value={state.quote}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.forMoreInformation"
          name="links"
          value={state.links}
          onChange={onChange}
        />
        <AdminFormFooter onSubmit={moveToMedia} />
      </AdminForm>
    </AdminPage>
  );
};

export default AdminCharacterForm;
