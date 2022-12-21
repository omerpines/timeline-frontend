import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import { getLocalized } from 'helpers/util';
import { getCharacterLink } from 'helpers/urls';
import config from 'constants/config';
import './style.css';

const CharacterDot = ({ data, className, ignorable }) => {
  const lang = useLanguage();

  const { characters } = useData();
  
  const innerData = useMemo(() => {
    const cid = parseInt(data.id);
    return characters.find(s => s.id === cid);
  }, [characters, data]);

  let classes = 'character-dot';
  if (className) classes += ` ${className}`;

  const styles = useMemo(() => {
    if (!innerData || !innerData.image) return undefined;
    return {
      backgroundImage: `url(${config.API}${innerData.image?.data?.attributes.url})`,
    };
  }, [innerData]);

  if (!innerData) return false;

  if (ignorable && (!innerData.image || !innerData.image.data)) return false;

  return (
    <div
      className={classes}
      title={getLocalized(innerData, 'name', lang)}
      style={styles}
    />
  );
};

export default CharacterDot;
