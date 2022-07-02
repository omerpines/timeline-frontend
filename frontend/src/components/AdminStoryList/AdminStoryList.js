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
import { requestDeleteStory } from 'store/actionCreators/stories';

const headers = [
  'admin.name.story',
  'admin.startDate',
  'admin.endDate',
  'admin.bookRelation',
  '',
  '',
];

const renderRow = (t, lang, onDelete) => s => {
  const startDate = formatYear(s.fromDate, t);
  const endDate = formatYear(s.endDate, t);

  return (
    <tr className="admin-story-row" key={s.id}>
      <td className="admin-story-row__name admin-table__name">
        {getLocalized(s, 'name', lang)}
      </td>
      <td className="admin-story-row__start admin-table__start">
        {startDate}
      </td>
      <td className="admin-story-row__end admin-table__end">
        {endDate}
      </td>
      <td className="admin-story-row__book admin-table__book" />
      <td className="admin-story-row__edit admin-table__edit">
        <Link className="admin-table__edit-link" to={`/admin/stories/edit/${s.id}`}>{t('admin.edit')}</Link>
      </td>
      <td className="admin-story-row__delete admin-table__delete" onClick={onDelete} data-id={s.id}>
        <i className="fa fa-trash" />
      </td>
    </tr>
  );
};

const AdminStoryList = () => {
  const { t } = useTranslation();
  
  const lang = useLanguage();
  const { stories } = useData();

  const [deleteModal, onDelete] = useDelete(requestDeleteStory);

  return (
    <AdminPage>
      <AdminPageTitle
        addTo="/admin/stories/add"
        addTitle="admin.add.story"
        title="admin.title.story"
        csvType="story"
      />
      <AdminTable headers={headers}>
        {stories.map(renderRow(t, lang, onDelete))}
      </AdminTable>
      {deleteModal}
    </AdminPage>
  );
};

export default AdminStoryList;
