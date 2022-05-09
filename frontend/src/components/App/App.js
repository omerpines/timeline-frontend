import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mergeRanges from 'merge-ranges';
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
import useData from 'hooks/useData';
import config from 'constants/config';
import { inRange } from 'helpers/util';
import { getStoryLink, getCharacterLink, getEventLink, getBookLink, getPeriodLink } from 'helpers/urls';
import { isDataLoading } from 'store/selectors/data';
import './style.scss';

const storyLink = getStoryLink(':id');
const characterLink = getCharacterLink(':id');
const eventLink = getEventLink(':id');
const bookLink = getBookLink(':id');
const periodLink = getPeriodLink(':id');

const useScroll = data => {
  const [current, setCurrent] = useState(config.INITIAL_YEAR);
  const [range, setRange] = useState(config.INITIAL_RANGE);

  const { pathname } = useLocation();

  const min = Math.ceil(current - range / 2);
  const max = Math.floor(current + range / 2);

  const filteredData = useMemo(() => {
    const filteredEvents = data.events.filter(dp => dp.fromDate <= max && dp.endDate >= min);

    const filteredStories = data.stories.filter(dp => {
      if (dp.fromDate && dp.endDate) return dp.fromDate <= max && dp.endDate >= min;

      return dp.date >= min && dp.date <= max;
    });

    const filteredPeriods = data.periods.filter(dp => {
      return dp.fromDate <= max && dp.endDate >= min;
    });

    const filteredCharacters = data.characters.filter(dp => {
      return dp.fromDate <= max && dp.endDate >= min;
    });

    const filteredBookGroups = data.bookGroups.filter(dp => {
      return dp.fromDate <= max && dp.endDate >= min;
    });

    return {
      stories: filteredStories.sort((a, b) => b.endDate - a.endDate),
      periods: filteredPeriods,
      characters: filteredCharacters,
      events: filteredEvents,
      bookGroups: filteredBookGroups,
    };
  }, [data, min, max]);

  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');

    const handleScroll = (e) => {
      if (isAdmin) return;
      if (e.deltaY > 0) setRange(a => inRange(config.MIN_RANGE, config.MAX_RANGE, a + 100));
      else setRange(a => inRange(config.MIN_RANGE, config.MAX_RANGE, a - 100));
    };

    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [pathname]);

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

  return [filteredData, min, max, current, onChangeCurrent];
}

const useFilters = data => {
  const [period, setPeriod] = useState(null);

  const periodData = useMemo(() => {
    if (!period) return data;

    return {
      periods: data.periods,
      stories: data.stories.filter(dp => dp.periodId === period),
      characters: data.characters.filter(dp => dp.periodId === period),
      bookGroups: data.bookGroups,
    };
  }, [period, data]);

  const onChangePeriod = useCallback(newPeriod => {
    if (newPeriod === period) setPeriod(null);
    else setPeriod(newPeriod);
  }, [period]);

  // return [periodData, onChangePeriod];
  return [data, onChangePeriod];
};

const useCharacterGroups = data => {
  const groups = useMemo(() => {
    const ranges = data.characters.map(c => [c.fromDate, c.endDate]);
    const groupedRanges = mergeRanges(ranges);
    
    const groups = groupedRanges.map(gr => ({ fromDate: gr[0], endDate: gr[1], characters: [] }));
    data.characters.forEach(c => {
      for (let i = 0, l = groupedRanges.length; i < l; i += 1) {
        const g = groups[i];
        if (c.fromDate >= g.fromDate && c.endDate <= g.endDate) {
          groups[i].characters.push(c);
          break;
        }
      }
    });

    return groups;
  }, [data.characters]);

  return groups || [];
};

const useWelcomeModal = () => {
  const [showModal, setShowModal] = useState(true);

  const onClose = useCallback(() => {
    setShowModal(false);
  }, []);

  return [showModal, onClose];
};

function App() {
  const data = useData();

  const isLoading = useSelector(isDataLoading);

  const [rangeData, min, max, current, setCurrent] = useScroll(data);
  const [filteredData, onChangePeriod] = useFilters(rangeData);
  const characterGroups = useCharacterGroups(filteredData);
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

  if (isLoading) return 'loading';

  return (
    <Routes>
      <Route path="/admin/*" element={
        <React.Fragment>
          <TimelineView
            data={filteredData}
            characterGroups={characterGroups}
            min={min}
            max={max}
            onChangePeriod={onChangePeriod}
            onMinimize={onMinimize}
            minimized={minimized}
            className="timeline--admin"
          />
          <SecuredPart />
        </React.Fragment>
      }/>
      <Route path="*" element={
        <div className="app">
          <Search/>
          <Logo />
          <div className="app__layout-horizontal">
            <div className="app__layout-vertical">
              <DimensionalView
                data={filteredData.events}
                min={min}
                max={max}
                onChangeCurrent={setCurrent}
              >
                <YearDisplay
                  className="year-display--in-dimensional"
                  current={min + Math.round(range / 100 * config.FOCUS_POINT)}
                />
              </DimensionalView>
              <TimelineView
                data={filteredData}
                characterGroups={characterGroups}
                min={min}
                max={max}
                onChangePeriod={onChangePeriod}
                onMinimize={onMinimize}
                minimized={minimized}
              />
            </div>
            {showWelcomeModal && <WelcomeModal onClose={onCloseWelcomeModal} />}
            <Routes>
              <Route path={storyLink} element={<StoryAside />} />
              <Route path={characterLink} element={<CharacterAside />} />
              <Route path={eventLink} element={<EventAside />} />
              <Route path={bookLink} element={<BookAside />} />
              <Route path={periodLink} element={<PeriodAside />} />
            </Routes>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
