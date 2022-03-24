import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminPage from 'components/AdminPage';
import AdminPageTitle from 'components/AdminPageTitle';
import AdminTable from 'components/AdminTable';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import { getLocalized } from 'helpers/util';
import { formatYear } from 'helpers/time';
import { requestDeleteBook } from 'store/actionCreators/books';

const headers = [
  'admin.name.book',
  'admin.startDate',
  'admin.endDate',
  'admin.periodRelation',
  '',
  '',
];

const renderRow = (t, lang, onDelete) => c => {
  const startDate = formatYear(c.fromDate, t);
  const endDate = formatYear(c.endDate, t);

  return (
    <tr className="admin-book-row" key={c.id}>
      <td className="admin-book-row__name admin-table__name">
        {getLocalized(c, 'name', lang)}
      </td>
      <td className="admin-book-row__start admin-table__start">
        {startDate}
      </td>
      <td className="admin-book-row__end admin-table__end">
        {endDate}
      </td>
      <td className="admin-book-row__relation admin-table__relation" />
      <td className="admin-book-row__edit admin-table__edit">
        <Link className="admin-table__edit-link" to={`/admin/books/edit/${c.id}`}>{t('admin.edit')}</Link>
      </td>
      <td className="admin-book-row__delete admin-table__delete" onClick={onDelete} data-id={c.id}>
        <i className="fa fa-trash" />
      </td>
    </tr>
  );
};

const AdminBookList = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  
  const lang = useLanguage();
  const { books } = useData();

  const onDelete = useCallback(e => {
    dispatch(requestDeleteBook(e.currentTarget.dataset.id));
  }, []);

  return (
    <AdminPage>
      <AdminPageTitle
        addTo="/admin/books/add"
        addTitle="admin.add.book"
        title="admin.title.book"
      />
      <AdminTable headers={headers}>
        {books.map(renderRow(t, lang, onDelete))}
      </AdminTable>
    </AdminPage>
  );
};

export default AdminBookList;
