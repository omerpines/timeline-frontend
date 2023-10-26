import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollArea from 'react-scrollbar/dist/no-css';
import useLanguage from 'hooks/useLanguage';
import config from 'constants/config';
import { getLocalized } from 'helpers/util';
import './style.css';

const initialStr = '';

const renderSelected = (lang, entities, onRemove) => id => {
  const entity = entities.find(e => e.id === id);
  if (!entity || !entity.name) return false;

  return (
    <div className="admin-multiselect__selected-option">
      <i className="admin-multiselect__remove fa fa-times" onClick={() => onRemove(id)} />
      <div className="admin-multiselect__name">{getLocalized(entity, 'name', lang)}</div>
      {entity.icon && entity.icon.data && (
        <div className="admin-multiselect__icon">
          <img
            className="admin-multiselect__icon-img"
            src={config.API + entity.icon.data.attributes.url}
            width={32}
            height={32}
          />
        </div>
      )}
    </div>
  );
};

const renderOption = (lang, onAdd, onDelete) => option => {
  return (
    <div className="admin-multiselect__option" onClick={() => onAdd(option.id)}>
      <div className="admin-multiselect__option-name">{getLocalized(option, 'name', lang)}</div>
      {option.icon && option.icon.data && (
        <img
          className="admin-multiselect__icon admin-multiselect__option-icon"
          src={config.API + option.icon.data.attributes.url}
          width={32}
          height={32}
        />
      )}
      <div className="admin-multiselect__option-gap" />
      <i className="admin-multiselect__delete fa fa-trash-o" onClick={() => onDelete(option.id)} />
    </div>
  );
}

const AdminMultiSelect = ({
  className,
  options,
  selectedIds,
  entities,
  onCreate,
  onDelete,
  onChange,
  createLabel,
  name,
  value,
  onChangeValue,
}) => {
  const lang = useLanguage();
  const { t } = useTranslation();

  const [opened, setOpened] = useState(false);

  const onChangeValueInner = useCallback(e => {
    const newValue = e.currentTarget.value;
    onChangeValue(newValue);
    if (!value.length && newValue.length && !opened) setOpened(true);
    else if (value.length && !newValue.length && opened) setOpened(false);
  }, [value, onChangeValue, opened]);

  const onToggleOpened = useCallback(() => setOpened(o => !o), []);

  const onAdd = useCallback(id => {
    if (selectedIds.indexOf(id) > -1) return;
    onChange(name, [...selectedIds, id]);
  }, [onChange, selectedIds, name]);

  const onRemove = useCallback(id => {
    if (selectedIds.indexOf(id) === -1) return;
    onChange(name, selectedIds.filter(i => i !== id));
  }, [onChange, selectedIds, name]);

  const filteredOptions = useMemo(() => {
    return options?.filter(o => o.name.startsWith(value) && selectedIds.indexOf(o.id) === -1);
  }, [value, options, selectedIds]);

  let classes = 'admin-form__text admin-multiselect';
  if (className) classes += ` ${className}`;

  let openIconClasses = 'admin-multiselect__open fa fa-chevron-down';
  if (opened) openIconClasses += ' admin-multiselect__open--opened';

  return (
    <div className={classes}>
      <div className="admin-multiselect__selected">
        {selectedIds.map(renderSelected(lang, entities, onRemove))}
      </div>
      <input className="admin-multiselect__value" type="text" label="" value={value} onChange={onChangeValueInner} />
      {opened && (
        <div className="admin-multiselect__options">
          <ScrollArea
            vertical
            smoothScrolling
            className="aside__scrollarea admin-multiselect__options-list"
            contentClassName="aside__scrollable admin-multiselect__options-content"
          >
            {filteredOptions.map(renderOption(lang, onAdd, onDelete))}
          </ScrollArea>
          <div className="admin-multiselect__new" onClick={onCreate}>
            <div className="admin-multiselect__new-label">{t(createLabel)}</div>
            <i className="admin-multiselect__new-icon fa fa-plus" />
          </div>
        </div>
      )}
      <i className={openIconClasses} onClick={onToggleOpened} />
    </div>
  );
};

export default AdminMultiSelect;
