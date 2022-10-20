import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactHtmlParser from 'react-html-parser';
import { throttle } from 'throttle-debounce';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import { getLocalized, denormalize } from 'helpers/util';
import { getEventLink } from 'helpers/urls';
import './style.css';

const useHover = () => {
  const [hovered, setHovered] = useState(false);

  const onMouseEnter = useCallback(throttle(200, () => {
    setHovered(true);
  }, []));

  const onMouseLeave = useCallback(throttle(200, () => {
    setHovered(false);
  }, []));

  return [hovered, onMouseEnter, onMouseLeave];
};

const renderCharacter = data => (!data ? false : (
  <CharacterDot key={data.id} data={data} className="story-preview__character" />
));

const StoryPreview = ({ data, size, opacity, styles, hoverable }) => {
  const lang = useLanguage();
  const { t } = useTranslation();

  const { characters } = useData();

  const [hoveredInner, onMouseEnter, onMouseLeave] = useHover();
  const hovered = hoveredInner && hoverable;

  const dataCharacters = useMemo(() => denormalize(data.characters, characters), [data, characters]);

  let classes = 'story-preview';

  if (size === 'large' || hovered) classes += ' story-preview--large';
  else if (size === 'big') classes += ' story-preview--big';
  else classes += ' story-preview--medium';
  if (hovered && size === 'medium') classes += ' story-preview--medium-hovered';
  if (hovered && size === 'big') classes += ' story-preview--big-hovered';

  const link = getEventLink(data.id);

  const imgStyles = useMemo(() => {
    if (!data || !data.media || !data.media.length) return {};
    
    const firstImage = data.media.find(m => m.type === 'image');
    if (!firstImage) return {};

    return {
      backgroundImage: `url(${firstImage.url})`,
    };
  }, [data]);

  const containerStyles = {
    ...styles,
    opacity: hovered ? 1 : opacity,
    zIndex: hovered ? 9999999 : 9999999 - data.endDate,
  };

  if (!hovered && (size === 'small' || size === 'cluster')) return false;

  if (!hovered && size === 'medium') return (
    <div className={classes} style={containerStyles} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link to={link} className="story-preview__header">
        <div className="story-preview__titles">
          <div className="story-preview__title">{getLocalized(data, 'name', lang)}</div>
        </div>
      </Link>
    </div>
  );
  
  if (!hovered && size === 'big') return (
    <div className={classes} style={containerStyles} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <header className="story-preview__header">
        <Link to={link} className="story-preview__more-arrow">
          <i className="fa fa-chevron-left story-preview__more-arrow-icon" />
        </Link>
        <div className="story-preview__titles">
          <div className="story-preview__title">{getLocalized(data, 'name', lang)}</div>
        </div>
      </header>
    </div>
  );

  return (
    <div className={classes} style={containerStyles} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {data.media && (size === 'large' || hovered || size === 'medium') && (
        <div className="story-preview__image-box" style={imgStyles} />
      )}
      <header className="story-preview__header">
        <Link to={link} className="story-preview__more-arrow">
          <i className="fa fa-chevron-left story-preview__more-arrow-icon" />
        </Link>
        {data.characters && (size === 'large' || hovered || size === 'medium') && (
          <div className="story-preview__characters">
            {dataCharacters.map(renderCharacter)}
          </div>
        )}
        <div className="story-preview__titles">
          <div className="story-preview__title">{getLocalized(data, 'name', lang)}</div>
          <div className="story-preview__subtitle">
            {ReactHtmlParser(`<div>${getLocalized(data, 'summary', lang)}</div>`)}
          </div>
        </div>
      </header>
      {(size === 'large' || hovered) && (
        <footer className="story-preview__footer">
          <Link to={link} className="story-preview__more-button">
            {t('common.readMore')}
          </Link>
        </footer>
      )}
    </div>
  );
};

export default StoryPreview;
