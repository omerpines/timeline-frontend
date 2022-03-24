import React from 'react';
import { Link } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import './style.css';

const CharacterBlock = ({ data, className, linkFn }) => {
  const lang = useLanguage();

  let classes = 'entity-block';
  if (className) classes += ` ${className}`;

  return (
    <Link
      to={linkFn(data.id)}
      className={classes}
    >
      {getLocalized(data, 'name', lang)}
    </Link>
  );
};

export default CharacterBlock;
