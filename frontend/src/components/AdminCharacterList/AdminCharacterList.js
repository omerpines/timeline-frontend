import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminPage from 'components/AdminPage';
import AdminPageTitle from 'components/AdminPageTitle';
import AdminTable from 'components/AdminTable';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import useDelete from 'hooks/useDelete';
import { getLocalized } from 'helpers/util';
import { formatYear } from 'helpers/time';
import { requestDeleteCharacter } from 'store/actionCreators/characters';

const headers = [
  '',
  'admin.name.character',
  'admin.startDate',
  'admin.endDate',
  'admin.relation.character.story',
  '',
  '',
];

const renderRow = (t, lang, onDelete) => c => {
  const startDate = formatYear(c.fromDate, t);
  const endDate = formatYear(c.endDate, t);

  return (
    <tr className="admin-character-row" key={c.id}>
      <td className="admin-character-row__image admin-table__image">
        <CharacterDot data={c} className="admin-table__character-dot" />
      </td>
      <td className="admin-character-row__name admin-table__name">
        {getLocalized(c, 'name', lang)}
      </td>
      <td className="admin-character-row__end admin-table__start">
        {startDate}
      </td>
      <td className="admin-character-row__end admin-table__end">
        {endDate}
      </td>
      <td className="admin-character-row__end admin-table__relation" />
      <td className="admin-character-row__edit admin-table__edit">
        <Link className="admin-table__edit-link" to={`/admin/characters/edit/${c.id}`}>{t('admin.edit')}</Link>
      </td>
      <td className="admin-character-row__delete admin-table__delete" onClick={onDelete} data-id={c.id}>
        <i className="fa fa-trash" />
      </td>
    </tr>
  );
};

const AdminCharacterList = () => {
  const { t } = useTranslation();
  
  const lang = useLanguage();
  const { characters } = useData();

  const [deleteModal, onDelete] = useDelete(requestDeleteCharacter);

  return (
    <AdminPage>
      <AdminPageTitle
        addTo="/admin/characters/add"
        addTitle="admin.add.character"
        title="admin.title.character"
        csvType="character"
      />
      <AdminTable headers={headers}>
        {characters.map(renderRow(t, lang, onDelete))}
      </AdminTable>
      {deleteModal}
    </AdminPage>
  );
};

export default AdminCharacterList;
