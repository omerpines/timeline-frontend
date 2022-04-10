import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import './style.css';

const formParams = {
  period: [
    'admin.recent.periods',
    '/admin/periods',
    '/admin/periods/add',
    '/admin/periods/edit',
  ],
  book: [
    'admin.recent.books',
    '/admin/books',
    '/admin/books/add',
    '/admin/books/edit',
  ],
  character: [
    'admin.recent.characters',
    '/admin/characters',
    '/admin/characters/add',
    '/admin/characters/edit',
  ],
  story: [
    'admin.recent.stories',
    '/admin/stories',
    '/admin/stories/add',
    '/admin/stories/edit',
  ],
  event: [
    'admin.recent.events',
    '/admin/events',
    '/admin/events/add',
    '/admin/events/edit',
  ],
};

const renderRow = (t, lang, editLink, oddStyles, evenStyles) => (entity, i) => {
  const isEven = i % 2 === 0;

  return (
    <tr key={entity.id} className="admin-recent__row" style={isEven ? evenStyles : oddStyles}>
      <td className="admin-recent__row-title">{getLocalized(entity, 'name', lang)}</td>
      <td className="admin-recent__row-edit">
        <Link className="admin-recent__row-edit-link" to={`${editLink}/${entity.id}`}>{t('admin.edit')}</Link>
      </td>
    </tr>
  );
};

const AdminRecent = ({ form, data, oddColor, evenColor }) => {
  const { t } = useTranslation();
  const lang = useLanguage();

  const params = formParams[form];
  const [title, fullLink, addLink, editLink] = params;
  
  const [oddStyles, evenStyles] = useMemo(() => {
    return [
      { backgroundColor: oddColor },
      { backgroundColor: evenColor },
    ];
  }, [oddColor, evenColor]);

  return (
    <div className="admin-recent">
      <header className="admin-recent__header">
        <div className="admin-recent__title">{t(title)}</div>
        <Link to={addLink} className="admin-recent__add">
        <span>הוספה מהירה</span> <img src='/plusSvg.svg'/>
          
        </Link>
      </header>
      <div className="admin-recent__body">
        <table className="admin-recent__table">
          <tbody className="admin-recent__table-body">
            {data.map(renderRow(t, lang, editLink, oddStyles, evenStyles))}
          </tbody>
        </table>
      </div>
      <footer className="admin-recent__footer">
        <Link to={fullLink} className="admin-recent__full">{t('admin.fullList')}</Link>
      </footer>
    </div>
  );
};

export default AdminRecent;
