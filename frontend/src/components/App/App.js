import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DimensionalView from 'components/DimensionalView';
import TimelineView from 'components/TimelineView';
import YearDisplay from 'components/YearDisplay';
import WelcomeModal from 'components/WelcomeModal';
import StoryAside from 'components/StoryAside';
import CharacterAside from 'components/CharacterAside';
import EventAside from 'components/EventAside';
import BookAside from 'components/BookAside';
import PeriodAside from 'components/PeriodAside';
import SecuredPart from 'components/SecuredPart';
import Logo from 'components/Logo';
import Search from 'components/SearchBar';
import Help from 'components/Help';
import Zoom from 'components/Zoom';
import useData from 'hooks/useData';
import useDrag from 'hooks/useDrag';
import useMobile from 'hooks/useMobile';
import config from 'constants/config';
import { inRange, fromRange } from 'helpers/util';
import { getStoryLink, getCharacterLink, getEventLink, getBookLink, getPeriodLink } from 'helpers/urls';
import { filterSortedByRange } from 'helpers/time';
import { isDataLoading } from 'store/selectors/data';
import './style.scss';

const skipWelcomeModal = window.localStorage.getItem('skipWelcomeModal');

const storyLink = getStoryLink(':id');
const characterLink = getCharacterLink(':id');
const eventLink = getEventLink(':id');
const bookLink = getBookLink(':id');
const periodLink = getPeriodLink(':id');

const zoomDiff = config.INITIAL_RANGE / 200 * config.MOUSE_ZOOM_INCREMENT;

const LEFT_RANGE = config.FOCUS_POINT / 100;
const RIGHT_RANGE = 1 - config.FOCUS_POINT / 100;

const minDesktopRange = Math.round(config.INITIAL_RANGE * config.MIN_DESKTOP_ZOOM / 100);
const maxDesktopRange = Math.round(config.INITIAL_RANGE * config.MAX_DESKTOP_ZOOM / 100);
const minMobileRange =  Math.round(config.INITIAL_RANGE * config.MIN_MOBILE_ZOOM / 100);
const maxMobileRange =  Math.round(config.INITIAL_RANGE * config.MAX_MOBILE_ZOOM / 100);

const useScroll = (data, zoomTo) => {
  const [current, setCurrent] = useState(config.INITIAL_YEAR);
  const [range, setRange] = useState(config.INITIAL_RANGE);

  const { pathname } = useLocation();

  const min = Math.ceil(current - range * LEFT_RANGE);
  const max = Math.floor(current + range * RIGHT_RANGE);

  const filteredData = useMemo(() => {
    return {
      characters: data.characters,
      events: filterSortedByRange(min, max, data.events),
      stories: filterSortedByRange(min, max, data.stories),
      periods: filterSortedByRange(min, max, data.periods),
      storyGroups: filterSortedByRange(min, max, data.storyGroups),
      characterGroups: filterSortedByRange(min, max, data.characterGroups),
      bookGroups: filterSortedByRange(min, max, data.bookGroups),
    };
  }, [data, min, max]);

  const timelineRange = Math.ceil(range * config.BOTTOM_RATIO);
  const tMin = Math.ceil(current - timelineRange * LEFT_RANGE);
  const tMax = Math.floor(current + timelineRange * RIGHT_RANGE);

  const filteredTimelineData = useMemo(() => {
    return {
      characters: data.characters,
      events: filterSortedByRange(tMin, tMax, data.events),
      stories: filterSortedByRange(tMin, tMax, data.stories),
      periods: filterSortedByRange(tMin, tMax, data.periods),
      storyGroups: filterSortedByRange(tMin, tMax, data.storyGroups),
      characterGroups: filterSortedByRange(tMin, tMax, data.characterGroups),
      bookGroups: filterSortedByRange(tMin, tMax, data.bookGroups),
    };
  }, [data, tMin, tMax]);

  const isMobile = useMobile();

  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');

    const inc = () => {
      const maxRange = isMobile ? maxMobileRange : maxDesktopRange;
      const newMin = min - zoomDiff;
      const newMax = max + zoomDiff;
      const newRange = newMax - newMin;
      if (newRange > maxRange) {
        const fix = (maxRange - (max - min)) / 2;
        zoomTo(Math.floor(min - fix), Math.ceil(max + fix));
      }
      else zoomTo(newMin, newMax);
    };

    const dec = () => {
      const minRange = isMobile ? minMobileRange : minDesktopRange;
      const newMin = min + zoomDiff;
      const newMax = max - zoomDiff;
      const newRange = newMax - newMin;
      if (newRange < minRange) {
        const fix = (max - min - minRange) / 2;
        zoomTo(Math.ceil(min + fix), Math.floor(max - fix));
      }
      else zoomTo(newMin, newMax);
    };

    const handleScroll = (e) => {
      if (isAdmin) return;

      const delta = Math.round(config.INITIAL_RANGE / 100 * config.MOUSE_ZOOM_INCREMENT);

      if (e.deltaY > 0) inc();
      else dec();
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [pathname, min, max, isMobile]);

  const onChangeCurrent = useCallback(diff => {
    setCurrent(current => {
      const newCurrent = current + diff;
      const halfRange = range / 2;
      const minBound = newCurrent - halfRange;
      const maxBound = newCurrent + halfRange;

      if (minBound < config.MIN_YEAR) return config.MIN_YEAR + halfRange;
      else if (maxBound > config.MAX_YEAR) return config.MAX_YEAR - halfRange;
      return newCurrent;
    });
  }, [range]);

  return [filteredData, min, max, filteredTimelineData, tMin, tMax, current, onChangeCurrent, setCurrent, setRange];
}

const useWelcomeModal = () => {
  const [showModal, setShowModal] = useState(true);

  const onClose = useCallback(() => {
    setShowModal(false);
  }, []);

  return [showModal, onClose];
};

function App() {
  const data = useData();
  const verticalRef = useRef(null);

  const isLoading = useSelector(isDataLoading);

  const [zoomTo, setZoomTo] = useState(null);
  const onZoom = useCallback((min, max) => {
    setZoomTo([min, max]);
  }, []);

  const [
    rangeData, min, max,
    rangeTimelineData, timelineMin, timelineMax,
    current, setCurrent, setCurrentDirectly,
    setRangeDirectly
  ] = useScroll(data, onZoom);
  const [showWelcomeModal, onCloseWelcomeModal] = useWelcomeModal();

  const range = max - min;

  const [minimized, setMinimized] = useState(false);
  const onMinimize = useCallback(() => {
    return setMinimized(a => !a);
  }, []);

  useEffect(() => {
    const triggerResize = () =>  window.dispatchEvent(new Event('resize'));

    triggerResize();

    let animate = { current: true };
    const loop = () => {
      triggerResize();
      if (animate.current) window.requestAnimationFrame(loop);
    };

    window.setTimeout(() => {
      animate.current = false;
    }, 200);

    loop();

    return () => window.setTimeout(triggerResize, 0);
    
  }, [minimized]);

  const [
    onDragStart,
    onDrag,
    onDragEnd,
    onDragTouchStart,
    onDragTouch,
    onDragTouchEnd,
  ] = useDrag(verticalRef, min, max, setCurrent);

  useEffect(() => {
    let frameHandle = null;

    if (zoomTo) {
      const [zoomMin, zoomMax] = zoomTo;
      const newRange = zoomMax - zoomMin;
      const newCurrent = Math.round((zoomMin + zoomMax) / 2);

      const initCurrent = current;
      const initRange = range;
      const currentDiff = newCurrent - initCurrent;
      const rangeDiff = newRange - initRange;

      let start = null;
      let end = null;

      const zoomTick = () => {
        frameHandle = window.requestAnimationFrame(ts => {
          if (!start) {
            start = ts;
            end = ts + 200;
          }

          if (ts >= end) {
            setCurrentDirectly(newCurrent);
            setRangeDirectly(newRange);
            setZoomTo(null);
            return;
          }
          const share = fromRange(start, end, ts);
          setCurrentDirectly(initCurrent + currentDiff * share);
          setRangeDirectly(initRange + rangeDiff * share);
          zoomTick();
        });
      };

      zoomTick();
    }

    return () => {
      if (frameHandle) cancelAnimationFrame(frameHandle);
    };
  }, [zoomTo]);

  if (isLoading) return 'loading';

  return (
    <Routes>
      <Route path="/admin/*" element={
        <React.Fragment>
          <TimelineView
            data={rangeData}
            min={min}
            max={max}
            onMinimize={onMinimize}
            minimized={minimized}
            className="timeline--admin"
            minimize
          />
          <SecuredPart />
        </React.Fragment>
      }/>
      <Route path="*" element={
        <div className="app">
          <Search/>
          <Logo />
          <div className="app__layout-horizontal">
            <div
              className="app__layout-vertical"
              ref={verticalRef}
              onMouseDown={onDragStart}
              onMouseMove={onDrag}
              onMouseUp={onDragEnd}
              onTouchStart={onDragTouchStart}
              onTouchMove={onDragTouch}
              onTouchEnd={onDragTouchEnd}
            >
              <DimensionalView data={rangeData.events} min={min} max={max} onZoom={onZoom}>
              </DimensionalView>
              <TimelineView
                data={rangeTimelineData}
                min={timelineMin}
                max={timelineMax}
                onMinimize={onMinimize}
                minimized={minimized}
              />
            </div>
            <YearDisplay
              className="year-display--in-dimensional"
              min={min}
              max={max}
            />
            <Help />
            <Zoom range={max - min} min={min} max={max} zoomTo={onZoom} />
            {showWelcomeModal && !skipWelcomeModal && <WelcomeModal onClose={onCloseWelcomeModal} />}
            <Routes>
              <Route path={storyLink} element={<StoryAside zoomTo={onZoom} min={min} max={max} />} />
              <Route path={characterLink} element={<CharacterAside zoomTo={onZoom} min={min} max={max} />} />
              <Route path={eventLink} element={<EventAside zoomTo={onZoom} min={min} max={max} />} />
              <Route path={bookLink} element={<BookAside zoomTo={onZoom} min={min} max={max} />} />
              <Route path={periodLink} element={<PeriodAside zoomTo={onZoom} min={min} max={max} />} />
            </Routes>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
