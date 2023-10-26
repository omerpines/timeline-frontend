import './style.scss';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { getBookLink, getCharacterLink, getEventLink, getPeriodLink, getStoryLink } from 'helpers/urls';

import BookAside from 'components/BookAside';
import CharacterAside from 'components/CharacterAside';
import DimensionalView from 'components/DimensionalView';
import EventAside from 'components/EventAside';
import Help from 'components/Help';
import Logo from 'components/Logo';
import PeriodAside from 'components/PeriodAside';
import Search from 'components/SearchBar';
import SecuredPart from 'components/SecuredPart';
import StoryAside from 'components/StoryAside';
import TimelineView from 'components/TimelineView';
import WelcomeModal from 'components/WelcomeModal';
import Zoom from 'components/Zoom';
import config from 'constants/config';
import { filterSortedByRange } from 'helpers/time';
import { fromRange } from 'helpers/util';
import { isDataLoading } from 'store/selectors/data';
import useData from 'hooks/useData';
import useDrag from 'hooks/useDrag';
import useMobile from 'hooks/useMobile';
import { useSelector } from 'react-redux';

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
const minMobileRange = Math.round(config.INITIAL_RANGE * config.MIN_MOBILE_ZOOM / 100);
const maxMobileRange = Math.round(config.INITIAL_RANGE * config.MAX_MOBILE_ZOOM / 100);

const useScroll = (data, zoomTo) => {
  const [current, setCurrent] = useState(config.INITIAL_YEAR);
  const [range, setRange] = useState(config.INITIAL_RANGE);

  const { pathname } = useLocation();

  const min = current - range * LEFT_RANGE;
  const max = current + range * RIGHT_RANGE;

  const filteredData = useMemo(() => {
    return {
      events: filterSortedByRange(min, max, data.events),
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
        zoomTo(min - fix, max + fix);
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
        zoomTo(min + fix, max - fix);
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

  const loadAccessibilityScript = () => {
    var script = document.createElement('script');
    script.src = 'https://js.nagich.co.il/core/4.1.1/accessibility.js';
    script.defer = true;
    script.integrity =
      'sha512-Sa9czHEwHavqXKmdJEaYdtc0YzuvwZmRRZoovLeWq8Lp5R4ZB1LLCSBoQm6ivUfuncFOM+/9oR08+WCAcBH61Q==';
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-cfasync', true);

    // Append the script to the document's head
    document.head.appendChild(script);
  };

  // Load the accessibility script when the component mounts
  useEffect(() => {
    loadAccessibilityScript();
  }, []);

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

  const isMobile = useMobile();

  const [range, setRange] = useState(max - min);

  useEffect(() => {
    if (isMobile) {
      setZoomTo([97061, 97081]);
      setRange(20);
    }
  }, [isMobile])

  useEffect(() => {
    setRange(max - min);
  }, [max, min]);
  const [minimized, setMinimized] = useState(false);
  const onMinimize = useCallback(() => {
    return setMinimized(a => !a);
  }, []);

  useEffect(() => {
    const triggerResize = () => window.dispatchEvent(new Event('resize'));
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
      const newCurrent = zoomMin + newRange * (config.FOCUS_POINT / 100);

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
      } />
      <Route path="*" element={
        <div className="app">
          <Search />
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
                ymin={min}
                ymax={max}
              />
            </div>
            <Help />
            <Zoom range={range} min={min} max={max} zoomTo={onZoom} />
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
