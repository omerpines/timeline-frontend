import React, { useMemo, useCallback } from 'react';
import { denormalize } from 'helpers/util';
import './style.css';

const renderEntity = (Type, onDelete) => data => data ? (
  <Type key={data.id} data={data} onDelete={onDelete} />
) : false;

const AdminRelationContainer = ({ name, ids, entities, component, onChange, onDelete, className }) => {
  const data = useMemo(() => denormalize(ids, entities), [ids, entities]);

  const innerOnDelete = useCallback(deletedId => {
    const newIds = ids.filter(id => id !== deletedId);
    onChange(name, newIds); 
  }, [name, ids, onChange]);

  let classes = 'admin-relations';
  if (className) classes += ` ${className}`;

  return (
    <div className={classes}>
      {data.map(renderEntity(component, onDelete || innerOnDelete))}
    </div>
  );
};

export default AdminRelationContainer;
