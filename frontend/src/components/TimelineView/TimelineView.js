import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TimelinePeriod from 'components/TimelinePeriod';
import TimelineStory from 'components/TimelineStory';
import TimelineCharacterGroup from 'components/TimelineCharacterGroup';
import TimelineBookGroup from 'components/TimelineBookGroup';
import TimelineFocusPoint from 'components/TimelineFocusPoint';
import './style.css';

const useSize = ref => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resize = () => {
      if (!ref.current) return;

      const { width } = ref.current.getBoundingClientRect();
      setWidth(width);
    };

    resize();

    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  return width;
};

const renderPeriod = (min, max, width, onChangePeriod) => data => {
  return (
    <TimelinePeriod
      key={data.id}
      min={min}
      max={max}
      width={width}
      data={data}
      onChangePeriod={onChangePeriod}
    />
  );
};

const renderStory = (min, max, width) => data => (
  <TimelineStory key={data.id} min={min} max={max} width={width} data={data} />
);

const renderCharacterGroup = (min, max, width) => data => (
  <TimelineCharacterGroup key={data.fromDate} min={min} max={max} width={width} data={data} />
);

const renderBookGroup = (min, max, width) => data => (
  <TimelineBookGroup group={data} min={min} max={max} width={width} />
);

const TimelineView = ({ data, characterGroups, min, max, onChangePeriod, onMinimize, minimized, className }) => {
  const { t } = useTranslation();

  const containerRef = useRef(null);
  const width = useSize(containerRef);

  let classes = 'timeline';
  if (minimized) classes += ` timeline--minimize`;
  if (className) classes += ' timeline--admin';

  return (
    <div className={classes}>
      <div className="timeline__minimize" onClick={onMinimize}>{t('timeline.minimize')}</div>
      <div className="timeline__container" ref={containerRef}>
        {data.periods.map(renderPeriod(min, max, width, onChangePeriod))}
        {data.stories.map(renderStory(min, max, width))}
        {characterGroups.map(renderCharacterGroup(min, max, width))}
        {data.bookGroups.map(renderBookGroup(min, max, width))}
      </div>
      <TimelineFocusPoint />
    </div>
  );
};

export default TimelineView;
