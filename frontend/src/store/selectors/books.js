import { createSelector } from 'reselect';

export const books = state => state.books;

export const isBooksLoading = createSelector(
  books,
  state => state.loading,
);

export const getBooks = createSelector(
  books,
  state => state.data,
);
