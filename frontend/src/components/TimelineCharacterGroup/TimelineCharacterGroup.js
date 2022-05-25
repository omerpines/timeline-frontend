import React, { useMemo } from 'react';
import CharacterDot from 'components/CharacterDot';
import useLanguage from 'hooks/useLanguage';
import { joinHebrew } from 'helpers/lang';
import { getLocalized } from 'helpers/util';
import './style.css';

const renderCharacter = (c, i) => {
  if (i > 2) return false;
  return (
    <CharacterDot key={c.id} data={c} className="timeline-character-group__character" />
  );
};

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

  return (
    <div className="timeline-character-group" style={styles}>
      <div className="timeline-character-group__visible">
        <div className="timeline-character-group__characters">
          {data.characters.map(renderCharacter)}
          {data.characters.length > 3 && (
            <div className="timeline-character-group__more">
              {`+ ${data.characters.length - 3}`}
            </div>
          )}
        </div>
        <div className="timeline-character-group__text">{text}</div>
      </div>
      <div className="timeline-character-group__hover" />
    </div>
  );
};

export default TimelineCharacterGroup;
