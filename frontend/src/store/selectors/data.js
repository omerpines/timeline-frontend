import { createSelector } from 'reselect';
import tagData from 'constants/tags';
import { getPeriods } from 'store/selectors/periods';
import { getCharacters } from 'store/selectors/characters';
import { getStories } from 'store/selectors/stories';
import { getEvents } from 'store/selectors/events';
import { getBooks } from 'store/selectors/books';
import { groupEntities } from 'helpers/util';

export const getData = createSelector(
  getPeriods,
  getCharacters,
  getStories,
  getEvents,
  getBooks,
  (periods, characters, stories, events, books) => ({
    periods,
    characters,
    stories,
    events,
    books,
    bookGroups: groupEntities(books),
    tags: tagData,
  }),
);
