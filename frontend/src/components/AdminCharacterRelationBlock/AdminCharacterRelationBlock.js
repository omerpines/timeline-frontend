import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AdminDropdown from 'components/AdminDropdown';
import AdminRelationContainer from 'components/AdminRelationContainer';
import AdminCharacterRelation from 'components/AdminCharacterRelation';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import { getLocalized } from 'helpers/util';
import './style.css';

const referenceOptions = [
  ['family', 'admin.character.relation.family'],
  ['brother', 'admin.character.relation.brother'],
  ['sister', 'admin.character.relation.sister'],
  ['son', 'admin.character.relation.son'],
  ['daughter', 'admin.character.relation.daughter'],
  ['father', 'admin.character.relation.father'],
  ['mother', 'admin.character.relation.mother'],
  ['grandfather', 'admin.character.relation.grandfather'],
  ['grandmother', 'admin.character.relation.grandmother'],
  ['husband', 'admin.character.relation.husband'],
  ['wife', 'admin.character.relation.wife'],
  ['concubine', 'admin.character.relation.concubine'],
  ['uncle', 'admin.character.relation.uncle'],
  ['aunt', 'admin.character.relation.aunt'],
  ['cousin_m', 'admin.character.relation.cousin_m'],
  ['cousin_f', 'admin.character.relation.cousin_f'],
];

const AdminCharacterRelationBlock = ({ name, value, currentId, onChange, idsOnly, placeholder, label, excluded }) => {
  const lang = useLanguage();
  const { t } = useTranslation();

  const [characterId, setCharacterId] = useState(null);
  const [reference, setReference] = useState(null);

  const { characters } = useData();

  const ids = useMemo(() => {
    if (!value) return [];
    return idsOnly ? value : value.map(r => r[0]); 
  }, [value, idsOnly]);

  let excludedIds = useMemo(() => {
    if (!excluded) return  idsOnly ? value : value.map(v => v.id);
    return idsOnly ? excluded : excluded.map(e => e.id);
  }, [excluded, idsOnly, value]);

  const characterOptions = useMemo(() => {
    const filteredCharacters = characters.filter(c => excludedIds.indexOf(c.id) < 0 && currentId !== c.id);
    return filteredCharacters.map(c => [c.id, getLocalized(c, 'name', lang)]);
  }, [ids, characters, lang, currentId, excludedIds]);

  const onChangeCharacter = useCallback((name, value) => {
    setCharacterId(value);
  }, []);

  const onChangeReference = useCallback((name, value) => {
    setReference(value);
  }, []);

  const onDelete = useCallback(deletedId => {
    const newValue = value.filter(([id]) => id !== deletedId);
    onChange(name, newValue);
  }, [value, name, onChange]);

  const onAdd = useCallback(() => {
    if (!characterId || (!idsOnly && !reference)) return;
    if (!idsOnly && value.find(([id]) => id === characterId)) return;
    if (idsOnly && value.find(id => id === characterId)) return;

    setCharacterId(null);
    setReference(null);
    onChange(name, [...value, idsOnly ? characterId : [characterId, reference]]);
  }, [characterId, reference, value, name, onChange, idsOnly]);

  return (
    <div className="character-relation-block">
      <AdminDropdown
        onChange={onChangeCharacter}
        value={characterId}
        options={characterOptions}
        placeholder={placeholder || "admin.character.relation.placeholder"}
        label={label || "admin.character.relation"}
        integer
        noTranslation
        className="character-relation-block__character"
      />
      <div className="character-relation-block__row">
        {!idsOnly && (
          <AdminDropdown
            onChange={onChangeReference}
            value={reference}
            options={referenceOptions}
            placeholder="admin.character.relation.reference"
            label=""
            className="character-relation-block__reference"
          />
        )}
        <button className="character-relation-block__add" onClick={onAdd}>
          {t('admin.character.relation.add')}
        </button>
      </div>
      <AdminRelationContainer
        name={name}
        ids={ids}
        entities={characters}
        component={AdminCharacterRelation}
        onDelete={onDelete}
        className="character-relation-block__relations"
      />
    </div>
  );
};

export default AdminCharacterRelationBlock;
