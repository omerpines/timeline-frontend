import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import { getStoryLink } from 'helpers/urls';
import './style.css';

const TimelineStory = ({ width, data, min, max }) => {
  const lang = useLanguage();

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
    <Link className="timeline__story" to={getStoryLink(data.id)} style={styles}>
      {getLocalized(data, 'name', lang)}
    </Link>
  );
};

export default TimelineStory;
