import types from 'store/actionTypes';
import { cleanApiObjects } from 'helpers/util';

export const requestBooks = () => ({
  type: types.BOOKS_REQUEST,
});

export const successBooks = books => ({
  type: types.BOOKS_SUCCESS,
  books: books.map(b => ({
    ...b,
    characters: cleanApiObjects(b.characters.data),
  })),
});

export const failureBooks = exception => ({
  type: types.BOOKS_FAILURE,
  exception,
});

export const resetBook = () => ({
  type: types.BOOK_RESET,
});

export const updateBook = (param, value) => ({
  type: types.BOOK_UPDATE,
  param,
  value,
});

export const requestFetchBook = id => ({
  type: types.BOOK_FETCH_REQUEST,
  id,
});

export const successFetchBook = (id, data) => ({
  type: types.BOOK_FETCH_SUCCESS,
  id,
  data: {
    ...data,
    characters: data.characters.data.map(c => c.id),
  },
});

export const failureFetchBook = (exception, id) => ({
  type: types.BOOK_FETCH_FAILURE,
  exception,
  id,
});

export const requestAddBook = data => ({
  type: types.BOOK_ADD_REQUEST,
  data,
});

export const successAddBook = data => ({
  type: types.BOOK_ADD_SUCCESS,
  data,
});

export const failureAddBook = exception => ({
  type: types.BOOK_ADD_FAILURE,
  exception,
});

export const requestEditBook = (id, data) => ({
  type: types.BOOK_EDIT_REQUEST,
  id,
  data,
});

export const successEditBook = (id, data) => ({
  type: types.BOOK_EDIT_SUCCESS,
  id,
  data,
});

export const failureEditBook = (exception, id) => ({
  type: types.BOOK_EDIT_FAILURE,
  exception,
  id,
});

export const requestDeleteBook = id => ({
  type: types.BOOK_DELETE_REQUEST,
  id,
});

export const successDeleteBook = id => ({
  type: types.BOOK_DELETE_SUCCESS,
  id,
});

export const failureDeleteBook = (exception, id) => ({
  type: types.BOOK_DELETE_FAILURE,
  exception,
  id,
});
