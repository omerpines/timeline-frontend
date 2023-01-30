import { createSelector } from 'reselect';
import { getPeriods, isPeriodsLoading } from 'store/selectors/periods';
import { getCharacters, isCharactersLoading } from 'store/selectors/characters';
import { getStories, isStoriesLoading } from 'store/selectors/stories';
import { getEvents, isEventsLoading } from 'store/selectors/events';
import { getBooks, isBooksLoading } from 'store/selectors/books';
import { getProfessions } from 'store/selectors/professions';
import { groupEntities } from 'helpers/util';
import { sortEntitiesByUpdatedAt, sortEntitiesByFromDate } from 'helpers/time';

export const sortedPeriods = createSelector(
  getPeriods,
  periods => periods.map(p => ({ ...p, type: 'period' })).sort(sortEntitiesByFromDate),
);

export const sortedCharacters = createSelector(
  getCharacters,
  characters => characters.map(c => ({ ...c, type: 'character' })).sort(sortEntitiesByFromDate),
);

export const sortedStories = createSelector(
  getStories,
  stories => stories.map(s => ({ ...s, type: 'story' })).sort(sortEntitiesByFromDate),
);

export const sortedEvents = createSelector(
  getEvents,
  events => events.map(e => ({ ...e, type: 'event' })).sort(sortEntitiesByFromDate),
);

export const sortedBooks = createSelector(
  getBooks,
  books => books.map(b => ({ ...b, type: 'book' })).sort(sortEntitiesByFromDate),
);

export const sortedBookGroups = createSelector(
  sortedBooks,
  books => groupEntities(books).sort(sortEntitiesByFromDate),
);

export const sortedStoryGroups = createSelector(
  sortedStories,
  stories => groupEntities(stories).sort(sortEntitiesByFromDate),
);

export const sortedCharacterGroups = createSelector(
  sortedCharacters,
  characters => groupEntities(characters).sort(sortEntitiesByFromDate),
);

export const getData = createSelector(
  sortedPeriods,
  sortedCharacters,
  sortedStories,
  sortedEvents,
  sortedBooks,
  sortedBookGroups,
  sortedStoryGroups,
  sortedCharacterGroups,
  (p, c, s, e, b, bg, sg, cg) => ({
    periods: p,
    characters: c,
    stories: s,
    events: e,
    books: b,
    bookGroups: bg,
    storyGroups: sg,
    characterGroups: cg,
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