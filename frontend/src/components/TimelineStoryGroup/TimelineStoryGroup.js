import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import { useTranslation } from 'react-i18next';
import TimelineStory from 'components/TimelineStory/TimelineStory';
import useLanguage from 'hooks/useLanguage';
import useData from 'hooks/useData';
import { getLocalized } from 'helpers/util';
import { getStoryLink, getEventLink } from 'helpers/urls';
import { formatYear } from 'helpers/time';
import { joinHebrew } from 'helpers/lang';
import './style.css';

const renderHoverStory = (showStory, eventsByStories) => s => (
  <li key={s.id} className="timeline-story-group__hover-story">
    {eventsByStories[s.id] && eventsByStories[s.id].length > 0 && (
      <i className="fa fa-eye timeline-story-group__hover-story-view" onClick={() => showStory(s.id)} />
    )}
    <Link to={getStoryLink(s.id)} className="timeline-story-group__hover-link">
      <div className="timeline-story-group__hover-name">{s.name}</div>
    </Link>
  </li>
);

const renderStoryListHover = (data, eventsByStories, showStory) => (
  <ScrollArea
    vertical
    smoothScrolling
    stopScrollPropagation
    className="aside__scrollarea timeline-story-group__scrollarea"
    contentClassName="aside__scrollable"
  >
    <ul className="timeline-story-group__hover-list">
      {data.map(renderHoverStory(showStory, eventsByStories))}
    </ul>
  </ScrollArea>
);

const renderHoverEvent = t => e => (
  <li key={e.id} className="timeline-story-group__hover-story timeline-story-group__hover-event">
    <Link to={getEventLink(e.id)} className="timeline-story-group__hover-link">
      <div className="timeline-story-group__hover-name">{e.name}</div>
      <div className="timeline-story-group__hover-year">{formatYear(e.fromDate, t)}</div>
    </Link>
  </li>
);

const renderEventListHover = (t, showStories, events, story) => (
  <React.Fragment>
    <header className="timeline-story-group__events-header">
      <div className="timeline-story-group__events-title">{story.name}</div>
      <i className="fa fa-chevron-left timeline-story-group__events-back" onClick={() => showStories()} />
    </header>
    <ScrollArea
      vertical
      smoothScrolling
      stopScrollPropagation
      className="aside__scrollarea timeline-story-group__scrollarea"
      contentClassName="aside__scrollable"
    >
      <ul className="timeline-story-group__hover-list">
        {events.map(renderHoverEvent(t))}
      </ul>
    </ScrollArea>
  </React.Fragment>
);

const TimelineStoryGroup = ({ group, min, max, width }) => {
  const lang = useLanguage();
  const { t } = useTranslation();

  const { events } = useData();
  const { data } = group;

  const [viewStory, setViewStory] = useState(false);

  const showStory = useCallback((id) => {
    setViewStory(id);
  }, []);

  const showStories = useCallback(() => {
    setViewStory(false);
  }, []);

  const eventsByStories = useMemo(() => {
    return events.reduce((acc, e) => {
      const sid = e.story;
      if (!acc[sid]) acc[sid] = [];
      acc[sid].push(e);
      return acc;
    }, {});
  }, [events, data]);

  const viewedEvents = useMemo(() => {
    if (!viewStory) return [];
    return eventsByStories[viewStory];
  }, [eventsByStories, viewStory]);

  const viewedStory = useMemo(() => {
    if (data.length === 1) return data[0];
    if (!viewStory) return null;

    return data.find(s => s.id === viewStory);
  }, [data, viewStory]);

  const text = useMemo(() => {
    let text = '';
    if (lang === 'he') text = joinHebrew(data.map(c => getLocalized(c, 'name', 'he')));
    else text = data.join(', ');
    return text;
  }, [data, lang]);

  const styles = useMemo(() => {
    const yearCost = width / (max - min);
    const length = group.endDate - group.fromDate + 1;

    const start = Math.floor((group.fromDate - min) * yearCost);
    return {
      width: Math.round(yearCost * length),
      transform: `translateX(${start * -1}px)`,
    };
  }, [width, group, min, max]);

  if (!data.length) return false;

  let hoverClasses = 'timeline-story-group__hover';
  if (viewedStory) hoverClasses += ' timeline-story-group__hover--events';
  if (viewedStory && viewedEvents.length < 1) hoverClasses += ' timeline-story-group__hover--invisible';

  return (
    <div className="timeline-story-group" style={styles}>
      <div className="timeline-story-group__visible timeline__story">
        <div className="timeline-story-group__text">{text}</div>
      </div>
      <div className={hoverClasses}>
        <div className="timeline-story-group__hover-wrapper">
          {!viewedStory && renderStoryListHover(data, eventsByStories, showStory)}
          {viewedStory && renderEventListHover(t, showStories, viewedEvents, viewedStory)}
        </div>
      </div>
      <div className="timeline-story-group__hover-bridge" />
    </div>
  );
};

export default TimelineStoryGroup;
