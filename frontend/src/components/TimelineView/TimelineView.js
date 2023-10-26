import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TimelinePeriod from 'components/TimelinePeriod';
import TimelineCharacterGroup from 'components/TimelineCharacterGroup';
import TimelineBookGroup from 'components/TimelineBookGroup';
import TimelineStoryGroup from 'components/TimelineStoryGroup';
import TimelineFocusPoint from 'components/TimelineFocusPoint';
import TimelineLegend from 'components/TimelineLegend';
import YearDisplay from 'components/YearDisplay';
import useData from 'hooks/useData';
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

const renderPeriod = (min, max, width) => data => {
  return (
    <TimelinePeriod
      key={data.id}
      min={min}
      max={max}
      width={width}
      data={data}
    />
  );
};

const renderCharacterGroup = (min, max, width) => data => (
  <TimelineCharacterGroup key={data.fromDate} group={data} min={min} max={max} width={width} />
);

const renderBookGroup = (min, max, width) => data => (
  <TimelineBookGroup group={data} key={data.fromDate} min={min} max={max} width={width} />
);

const renderStoryGroup = (min, max, width) => data => (
  <TimelineStoryGroup group={data} key={data.fromDate} min={min} max={max} width={width} />
);

const TimelineView = ({
  characterGroups,
  min,
  max,
  onMinimize,
  minimized,
  className,
  minimize,
  ymin,
  ymax
}) => {
  const { t } = useTranslation();

  const data = useData();

  const containerRef = useRef(null);
  const width = useSize(containerRef);

  useEffect(() => {
    if (minimize && !minimized) onMinimize();
    else if (!minimize && minimized) onMinimize();
  }, []);

  let classes = 'timeline';
  if (minimized) classes += ` timeline--minimize`;
  if (className) classes += ' timeline--admin';

  return (
    <div className={classes}>
      <div className="timeline__minimize" onClick={onMinimize}>
        {!minimized && t('timeline.minimize')}
        {minimized && t('timeline.expand')}
      </div>
      <div
        className="timeline__container"
        ref={containerRef}
      >
        {data.periods.map(renderPeriod(min, max, width))}
        {data.storyGroups.map(renderStoryGroup(min, max, width))}
        {data.characterGroups.map(renderCharacterGroup(min, max, width))}
        {data.bookGroups.map(renderBookGroup(min, max, width))}
      </div>
      <TimelineLegend />
      <TimelineFocusPoint min={ymin} max={ymax} />
    </div>
  );
};

export default TimelineView;
