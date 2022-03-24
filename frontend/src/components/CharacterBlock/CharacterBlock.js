import React from 'react';
import { Link } from 'react-router-dom';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import { getCharacterLink } from 'helpers/urls';
import './style.css';

const CharacterBlock = ({ data, className }) => {
  const lang = useLanguage();

  let classes = 'character-block';
  if (className) classes += ` ${className}`;

  return (
    <Link
      to={getCharacterLink(data.id)}
      className={classes}
    >
      <CharacterDot data={data} className="character-block__dot" /> 
      {getLocalized(data, 'name', lang)}
    </Link>
  );
};

export default CharacterBlock;
