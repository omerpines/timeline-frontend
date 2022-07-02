import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminPage from 'components/AdminPage';
import AdminPageTitle from 'components/AdminPageTitle';
import AdminTable from 'components/AdminTable';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import useDelete from 'hooks/useDelete';
import { getLocalized } from 'helpers/util';
import { formatYear } from 'helpers/time';
import { requestDeletePeriod } from 'store/actionCreators/periods';

const headers = [
  'admin.name.period',
  'admin.startDate',
  'admin.endDate',
  '',
  '',
];

const renderRow = (t, lang, onDelete) => p => {
  const startDate = formatYear(p.fromDate, t);
  const endDate = formatYear(p.endDate, t);

  return (
    <tr className="admin-period-row" key={p.id}>
      <td className="admin-period-row__name admin-table__name">
        {getLocalized(p, 'name', lang)}
      </td>
      <td className="admin-period-row__end admin-table__start">
        {startDate}
      </td>
      <td className="admin-period-row__end admin-table__end">
        {endDate}
      </td>
      <td className="admin-period-row__edit admin-table__edit">
        <Link className="admin-table__edit-link" to={`/admin/periods/edit/${p.id}`}>{t('admin.edit')}</Link>
      </td>
      <td className="admin-period-row__delete admin-table__delete" onClick={onDelete} data-id={p.id}>
        <i className="fa fa-trash" />
      </td>
    </tr>
  );
};

const AdminPeriodList = () => {
  const { t } = useTranslation();
  
  const lang = useLanguage();
  const { periods } = useData();

  const [deleteModal, onDelete] = useDelete(requestDeletePeriod);

  return (
    <AdminPage>
      <AdminPageTitle
        addTo="/admin/periods/add"
        addTitle="admin.add.period"
        title="admin.title.period"
        csvType="period"
      />
      <AdminTable headers={headers}>
        {periods.map(renderRow(t, lang, onDelete))}
      </AdminTable>
      {deleteModal}
    </AdminPage>
  );
};

export default AdminPeriodList;
