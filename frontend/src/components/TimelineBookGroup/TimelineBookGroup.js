import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import TimelineGroup from 'components/TimelineGroup';
import useLanguage from 'hooks/useLanguage';
import { getLocalized } from 'helpers/util';
import { getBookLink } from 'helpers/urls';
import { joinHebrew } from 'helpers/lang';
import './style.css';

const renderHoverBook = c => (
  <li key={c.id} className="timeline-group__hover-element">
    <Link to={getBookLink(c.id)} className="timeline-group__hover-link">
      <span className="timeline-group__hover-name">{c.name}</span>
    </Link>
  </li>
);

const TimelineBookGroup = ({ group, width, min, max }) => {
  const lang = useLanguage();

  const { data, fromDate, endDate } = group;

  const text = useMemo(() => {
    let text = '';
    if (lang === 'he') text = joinHebrew(data.map(b => getLocalized(b, 'name', 'he')));
    else text = data.join(', ');
    return text;
  }, [data]);

  let hoverClasses = 'timeline-group__hover';
  if (data.length > 3) hoverClasses += ' timeline-group__hover--list';

  const renderTooltip = useCallback(id => {
    return (
      <div className={hoverClasses} data-group-id={id}>
        <div className="timeline-group__hover-wrapper">
          <ScrollArea
            vertical
            smoothScrolling
            stopScrollPropagation
            className="aside__scrollarea timeline-group__scrollarea"
            contentClassName="aside__scrollable"
          >
            <ul className="timeline-group__hover-list">
              {data.map(renderHoverBook)}
            </ul>
          </ScrollArea>
        </div>
      </div>
    );
  }, []);

  return (
    <TimelineGroup
      data={data}
      fromDate={fromDate}
      endDate={endDate}
      min={min}
      max={max}
      width={width}
      className="timeline-book-group"
      visibleClassName="timeline-book-group__visible"
      visibleContent={(
        <div className="timeline-book-group__text">{text}</div>
      )}
      tooltipClassName="timeline-book-group__hover-positioning"
      renderTooltip={renderTooltip}
      linkFn={getBookLink}
    />
  );
};

export default TimelineBookGroup;
