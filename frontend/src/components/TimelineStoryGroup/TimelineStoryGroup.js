import './style.css';

import React, { useCallback, useMemo, useState } from 'react';
import { getEventLink, getStoryLink } from 'helpers/urls';

import { Link } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import TimelineGroup from 'components/TimelineGroup';
import { formatYear } from 'helpers/time';
import { getLocalized } from 'helpers/util';
import { joinHebrew } from 'helpers/lang';
import useData from 'hooks/useData';
import useLanguage from 'hooks/useLanguage';
import { useTranslation } from 'react-i18next';

const detectAsideEvent = () => {
  const message = JSON.stringify({
    channel: 'hideTooltip'
  });
  window.parent.postMessage(message, '*');
}

const renderHoverStory = (showStory, eventsByStories) => s => (
  <li key={s.id} className="timeline-story-group__hover-story" onClick={detectAsideEvent}>
    {eventsByStories[s.id] && eventsByStories[s.id].length > 0 && (
      <i className="fa fa-eye timeline-story-group__hover-story-view" onClick={() => showStory(s.id)} />
    )}
    <Link to={getStoryLink(s.id)} className="timeline-story-group__hover-link">
      <div className="timeline-story-group__hover-name">{s.name}</div>
    </Link>
  </li>
);

const renderHoverStoryT = c => (
  <li key={c.id} className="timeline-group__hover-element">
    <Link to={getStoryLink(c.id)} className="timeline-group__hover-link">
      <span className="timeline-group__hover-name">{c.name}</span>
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
  const { data, fromDate, endDate } = group;

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

  let hoverClasses = 'timeline-group__hover';
  if (viewedStory) hoverClasses += ' timeline-group__hover--events';
  if (viewedStory && viewedEvents.length < 1) hoverClasses += ' timeline-group__hover--invisible';
  if (
    (!viewedStory && data.length > 3)
    || (viewedStory && viewedEvents.length > 3)
  ) hoverClasses += ' timeline-group__hover--list';

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
              {data.map(renderHoverStoryT)}
            </ul>
          </ScrollArea>
        </div>
      </div>
    );
  }, []);

  if (!data.length) return false;

  return (
    <TimelineGroup
      data={data}
      fromDate={fromDate}
      endDate={endDate}
      min={min}
      max={max}
      width={width}
      className="timeline-story-group"
      visibleClassName="timeline-story-group__visible"
      visibleContent={(
        <div className="timeline-story-group__text">{text}</div>
      )}
      tooltipClassName="timeline-story-group__hover-positioning"
      renderTooltip={renderTooltip}
      linkFn={getStoryLink}
    />
  );
};

export default TimelineStoryGroup;
