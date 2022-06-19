import { createSelector } from 'reselect';
import tagData from 'constants/tags';
import { getPeriods, isPeriodsLoading } from 'store/selectors/periods';
import { getCharacters, isCharactersLoading } from 'store/selectors/characters';
import { getStories, isStoriesLoading } from 'store/selectors/stories';
import { getEvents, isEventsLoading } from 'store/selectors/events';
import { getBooks, isBooksLoading } from 'store/selectors/books';
import { groupEntities } from 'helpers/util';
import { sortEntitiesByUpdatedAt, sortEntitiesByEndDate } from 'helpers/time';

export const getData = createSelector(
  getPeriods,
  getCharacters,
  getStories,
  getEvents,
  getBooks,
  (periods, characters, stories, events, books) => ({
    periods: periods.map(p => ({ ...p, type: 'period' })).sort(sortEntitiesByEndDate),
    characters: characters.map(c => ({ ...c, type: 'character' })).sort(sortEntitiesByEndDate),
    stories: stories.map(s => ({ ...s, type: 'story' })).sort(sortEntitiesByEndDate),
    events: events.map(e => ({ ...e, type: 'event' })).sort(sortEntitiesByEndDate),
    books: books.map(b => ({ ...b, type: 'book' })).sort(sortEntitiesByEndDate),
    bookGroups: groupEntities(books),
    tags: tagData,
  }),
);

const extractRecents = es => sortEntitiesByUpdatedAt(es).slice(0, 3);

export const getRecents = createSelector(
  getPeriods,
  getCharacters,
  getStories,
  getEvents,
  getBooks,
  (periods, characters, stories, events, books) => ({
    periods: extractRecents(periods),
    characters: extractRecents(characters),
    stories: extractRecents(stories),
    events: extractRecents(events),
    books: extractRecents(books),
  }),
);

export const isDataLoading = createSelector(
  isPeriodsLoading,
  isCharactersLoading,
  isStoriesLoading,
  isEventsLoading,
  isBooksLoading,
  (p, c, s, e, b) => p && c && s && e && b,
);