import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import { joinHebrew } from 'helpers/lang';
import { getLocalized } from 'helpers/util';
import { getCharacterLink } from 'helpers/urls';
import './style.css';

const renderCharacter = (c, i) => {
  if (i > 2) return false;
  return (
    <CharacterDot key={c.id} data={c} className="timeline-character-group__character" />
  );
};

const renderHoverCharacter = c => (
  <li key={c.id} className="timeline-character-group__hover-character">
    <Link to={getCharacterLink(c.id)} className="timeline-character-group__hover-link">
      <CharacterDot data={c} className="timeline-character-group__hover-dot" />
      <span className="timeline-character-group__hover-name">{c.name}</span>
    </Link>
  </li>
);

const TimelineCharacterGroup = ({ data, width, min, max }) => {
  const lang = useLanguage();

  const text = useMemo(() => {
    let text = '';
    if (lang === 'he') text = joinHebrew(data.characters.map(c => getLocalized(c, 'name', 'he')));
    else text = data.characters.join(', ');
    return text;
  }, [data]);

  const styles = useMemo(() => {
    const yearCost = width / (max - min);
    const length = data.endDate - data.fromDate + 1;

    const start = Math.floor((data.fromDate - min) * yearCost);
    return {
      width: Math.round(yearCost * length),
      transform: `translateX(${start * -1}px)`,
    };
  }, [width, data, min, max]);

  let hoverClasses = 'timeline-character-group__hover';
  if (data.characters.length > 3) hoverClasses += ' timeline-character-group__hover--list';

  if (data.characters.length === 1) {
    const [character] = data.characters;
    return (
      <Link to={getCharacterLink(character.id)} className="timeline-character-group" style={styles}>
        <div className="timeline-character-group__visible">
          <div className="timeline-character-group__characters">{renderCharacter(character, 0)}</div>
          <div className="timeline-character-group__text">{text}</div>
        </div>
      </Link>
    );
  }

  return (
    <div className="timeline-character-group" style={styles}>
      <div className="timeline-character-group__visible">
        <div className="timeline-character-group__characters">
          {data.characters.map(renderCharacter)}
          {data.characters.length > 3 && (
            <div className="timeline-character-group__more">
              {`+${data.characters.length - 3}`}
            </div>
          )}
        </div>
        <div className="timeline-character-group__text">{text}</div>
      </div>
      <div className={hoverClasses}>
        <div className="timeline-character-group__hover-wrapper">
          <ScrollArea
            vertical
            smoothScrolling
            stopScrollPropagation
            className="aside__scrollarea timeline-character-group__scrollarea"
            contentClassName="aside__scrollable"
          >
            <ul className="timeline-character-group__hover-list">
              {data.characters.map(renderHoverCharacter)}
            </ul>
          </ScrollArea>
        </div>
      </div>
      <div className="timeline-character-group__hover-bridge" />
    </div>
  );
};

export default TimelineCharacterGroup;
