import React, { useCallback } from 'react';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import './style.css';

const AdminCharacterRelation = ({ data, onDelete }) => {
  const lang = useLanguage();

  const onDeleteInner = useCallback(() => {
    onDelete(data.id);
  }, [onDelete, data]);

  return (
    <div className="admin-character-relation">
      <CharacterDot data={data} className="admin-character-relation__dot" />
      <div className="admin-character-relation__name">{getLocalized(data, 'name', lang)}</div>
      <div className="admin-character-relation__delete" onClick={onDeleteInner}>
        <i className="fa fa-times" />
      </div>
    </div>
  );
};

export default AdminCharacterRelation;
