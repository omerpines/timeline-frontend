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
import { requestDeleteEvent } from 'store/actionCreators/events';

const headers = [
  'admin.name.event',
  'admin.storyRelation',
  'admin.bookRelation',
  '',
  '',
];

const renderRow = (t, lang, onDelete, stories) => c => {
  const story = c.story ? stories.find(s => s.id === c.story) : false;

  return (
    <tr className="admin-event-row" key={c.id}>
      <td className="admin-event-row__name admin-table__name">
        {getLocalized(c, 'name', lang)}
      </td>
      <td className="admin-event-row__story admin-table__story">
        {story && getLocalized(story, 'name', lang)}
      </td>
      <td className="admin-event-row__years admin-table__years">
        {formatYear(c.fromDate, t)}
      </td>
      <td className="admin-event-row__edit admin-table__edit">
        <Link className="admin-table__edit-link" to={`/admin/events/edit/${c.id}`}>{t('admin.edit')}</Link>
      </td>
      <td className="admin-event-row__delete admin-table__delete" onClick={onDelete} data-id={c.id}>
        <i className="fa fa-trash" />
      </td>
    </tr>
  );
};

const AdminEventList = () => {
  const { t } = useTranslation();
  
  const lang = useLanguage();
  const { events, stories } = useData();

  const [deleteModal, onDelete] = useDelete(requestDeleteEvent);

  return (
    <AdminPage>
      <AdminPageTitle
        addTo="/admin/events/add"
        addTitle="admin.add.event"
        title="admin.title.event"
        csvType="event"
      />
      <AdminTable headers={headers}>
        {events.map(renderRow(t, lang, onDelete, stories))}
      </AdminTable>
      {deleteModal}
    </AdminPage>
  );
};

export default AdminEventList;
