import React from 'react';
import { useParams } from 'react-router-dom';
import AdminPage from 'components/AdminPage';
import AdminForm from 'components/AdminForm';
import AdminFormTitle from 'components/AdminFormTitle';
import AdminFileInput from 'components/AdminFileInput';
import AdminDateInput from 'components/AdminDateInput';
import AdminColorInput from 'components/AdminColorInput';
import AdminInput from 'components/AdminInput';
import AdminFormFooter from 'components/AdminFormFooter';
import AdminMediaLibrary from 'components/AdminMediaLibrary';
import useForm from 'hooks/useForm';
import useAdminTab from 'hooks/useAdminTab';
import {
  resetPeriod,
  updatePeriod,
  requestFetchPeriod,
  requestAddPeriod,
  requestEditPeriod,
} from 'store/actionCreators/periods';
import { periodForm } from 'store/selectors/periodForm';

const AdminPeriodForm = ({ editMode }) => {
  const { id } = useParams();

  const [state, onChange] = useForm(
    periodForm,
    resetPeriod,
    updatePeriod,
    requestFetchPeriod,
    requestAddPeriod,
    requestEditPeriod,
    id,
  );

  const [showMedia, moveToForm, moveToMedia] = useAdminTab();

  const formTitle = editMode ? 'admin.period.title.edit' : 'admin.period.title.add';

  return showMedia ? (
    <AdminMediaLibrary form="period" onBack={moveToForm} />
  ) : (
    <AdminPage>
      <AdminFormTitle title={formTitle} step={1} totalSteps={2} />
      <AdminForm>
        <div className="admin-form__columns">
          <div className="admin-form__column">
            <AdminInput
              type="text"
              label="admin.period.name"
              name="name"
              value={state.name}
              onChange={onChange}
            />
            <AdminDateInput onChange={onChange} state={state} />
            <AdminColorInput onChange={onChange} name="color" value={state.color} />
          </div>
          <div className="admin-form__column admin-form__column--no-grow">
            <AdminFileInput
              label="admin.period.background"
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
          label="admin.period.description"
          name="description"
          value={state.description}
          onChange={onChange}
        />
        <AdminInput
          type="textarea"
          label="admin.period.majorEvents"
          name="majorEvents"
          value={state.majorEvents}
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

export default AdminPeriodForm;
