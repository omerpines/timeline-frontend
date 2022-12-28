import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import { getCharacterLink } from 'helpers/urls';
import './style.css';

const CharacterBlock = ({ data, className }) => {
  const lang = useLanguage();
  const { t } = useTranslation();

  let classes = 'character-block';
  if (className) classes += ` ${className}`;

  return (
    <Link
      to={getCharacterLink(data.id)}
      className={classes}
    >
      {/*<CharacterDot data={data} className="character-block__dot" />*/} 
      <div className="character-block__data">
        <div className="character-block__name">{getLocalized(data, 'name', lang)}</div>
        {data.relation ? (
          <div className="character-block__relation">
            {t(`admin.character.relation.${data.relation}`)}
          </div>
        ) : false}
      </div>
    </Link>
  );
};

export default CharacterBlock;
