import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import { getBookLink } from 'helpers/urls';
import './style.css';

const renderBook = lang => b => {
  return (
    <Link key={b.id} to={getBookLink(b.id)} className="timeline-book-group__book">
      {getLocalized(b, 'name', lang)}
    </Link>
  );
};

const TimelineBookGroup = ({ group, width, min, max }) => {
  const lang = useLanguage();

  const { fromDate, endDate, data } = group;

  const styles = useMemo(() => {
    const yearCost = width / (max - min);
    const length = endDate - fromDate + 1;

    const start = Math.floor((fromDate - min) * yearCost);
    return {
      width: Math.round(yearCost * length),
      transform: `translateX(${start * -1}px)`,
    };
  }, [width, fromDate, endDate, min, max]);

  return (
    <div className="timeline-book-group" style={styles}>
      {data.map(renderBook(lang))}
    </div>
  );
};

export default TimelineBookGroup;
