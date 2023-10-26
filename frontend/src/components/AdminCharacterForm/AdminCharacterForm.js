import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminPage from 'components/AdminPage';
import AdminForm from 'components/AdminForm';
import AdminFormTitle from 'components/AdminFormTitle';
import AdminFileInput from 'components/AdminFileInput';
import AdminDateInput from 'components/AdminDateInput';
import AdminInput from 'components/AdminInput';
import AdminFormFooter from 'components/AdminFormFooter';
import AdminDropdown from 'components/AdminDropdown';
import AdminRadioButton from 'components/AdminRadioButton';
import AdminCharacterRelationBlock from 'components/AdminCharacterRelationBlock';
import AdminMultiSelect from 'components/AdminMultiSelect';
import AdminMediaLibrary from 'components/AdminMediaLibrary';
import AdminAddProfessionModal from 'components/AdminAddProfessionModal';
import useForm from 'hooks/useForm';
import useData from 'hooks/useData';
import useAdminTab from 'hooks/useAdminTab';
import {
  resetCharacter,
  updateCharacter,
  requestFetchCharacter,
  requestAddCharacter,
  requestEditCharacter,
} from 'store/actionCreators/characters';
import { characterForm } from 'store/selectors/characterForm';
import { requestDeleteProfession } from 'store/actionCreators/professions';
import './style.css';

const emptyString = '';

const genderOptions = [
  ['male', 'admin.gender.male'],
  ['female', 'admin.gender.female'],
];

const showOptions = [
  'admin.showTimeLine.show',
  'admin.showTimeLine.hide',
]

const AdminCharacterForm = ({ editMode }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const pid = parseInt(id, 10);
  const [showintimeline, setShowInTimeLine] = useState(0)

  const { professions } = useData();

  const [state, onChange] = useForm(
    characterForm,
    resetCharacter,
    updateCharacter,
    requestFetchCharacter,
    requestAddCharacter,
    requestEditCharacter,
    id,
  );

  useEffect(() => {
    setShowInTimeLine(state.showTimeLine)
  }, [state]);

  const [showMedia, moveToForm, moveToMedia] = useAdminTab();
  
  const [professionValue, setProfessionValue] = useState(emptyString);
  const onChangeProfessionValue = useCallback((value) => {
    setProfessionValue(value);
  }, []);

  const [showAddProfession, setShowAddProfession] = useState(false);
  const onCloseAddProfession = useCallback(() => setShowAddProfession(false), []);
  const onShowAddProfession = useCallback(() => setShowAddProfession(true), []);

  const formTitle = editMode ? 'admin.character.title.edit' : 'admin.character.title.add';

  const onDeleteProfession = useCallback(id => {
    dispatch(requestDeleteProfession(id));
  }, []);

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
            <AdminRadioButton value={showintimeline} options={showOptions} onChange={onChange} name="showTimeLine" label="admin.showTimeLine"/>
          </div>
        </div>
        <AdminInput type="text" label="admin.character.role" name="role" value={state.role} onChange={onChange} />
        {/* <AdminMultiSelect
          options={professions}
          selectedIds={state.profession_tags}
          entities={professions}
          onCreate={onShowAddProfession}
          onDelete={onDeleteProfession}
          onChange={onChange}
          createLabel="admin.character.roles"
          name="profession_tags"
          value={professionValue}
          onChangeValue={onChangeProfessionValue}
        /> */}
        <AdminInput type="text" label="admin.character.nation" name="nation" value={state.nation} onChange={onChange} />
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
        <AdminFormFooter onSubmit={moveToMedia} disableSubmit={state.fromDate === null || state.endDate === null || !state.name} />
      </AdminForm>
      {showAddProfession && (
        <AdminAddProfessionModal onClose={onCloseAddProfession} initialValue={professionValue} />
      )}
    </AdminPage>
  );
};

export default AdminCharacterForm;
