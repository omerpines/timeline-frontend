import { take, fork, call, put } from 'redux-saga/effects';
import { callApi, callAuthenticatedApi } from 'store/sagas/callApi';
import types from 'store/actionTypes';
import {
  resetBook,
  successBooks,
  failureBooks,
  successFetchBook,
  failureFetchBook,
  successDeleteBook,
  failureDeleteBook,
  successAddBook,
  failureAddBook,
  successEditBook,
  failureEditBook,
} from 'store/actionCreators/books';
import { compilePath, cleanApiObject, cleanApiObjects, JSONToFormData } from "helpers/util";

const emptyObject = {};

const endpoints = {
  'FETCH_ALL': ['GET', compilePath('/api/books')],
  'FETCH': ['GET', compilePath('/api/books/:id')],
  'CREATE': ['POST', compilePath('/api/books')],
  'UPDATE': ['PUT', compilePath('/api/books/:id')],
  'DELETE': ['DELETE', compilePath('/api/books/:id')],
};

export function* fetchBooks() {
  try {
    const [method, generatePath] = endpoints.FETCH_ALL;
    const response = yield call(callApi, method, generatePath(emptyObject), { populate: ['characters'] });
    yield put(successBooks(cleanApiObjects(response.data.data)));
  } catch (e) {
    yield put(failureBooks(e));
  }
}

export function* onFetchBooks() {
  while (true) {
    yield take(types.BOOKS_REQUEST);
    yield fork(fetchBooks);
  }
}

export function* fetchBook({ id }) {
  try {
    yield put(resetBook());
    const [method, generatePath] = endpoints.FETCH;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath({ id }),
      { populate: ['background', 'picture', 'characters'] },
    );
    yield put(successFetchBook(id, cleanApiObject(response.data.data)));
  } catch (e) {
    yield put(failureFetchBook(e, id));
  }
}

export function* onFetchBook() {
  while (true) {
    const action = yield take(types.BOOK_FETCH_REQUEST);
    yield fork(fetchBook, action);
  }
}

export function* deleteBook({ id }) {
  try {
    const [method, generatePath] = endpoints.DELETE;
    yield call(callAuthenticatedApi, method, generatePath({ id }), {});
    yield put(successDeleteBook(id));
    yield call(fetchBooks);
  } catch (e) {
    yield put(failureDeleteBook(e, id));
  }
}

export function* onDeleteBook() {
  while (true) {
    const action = yield take(types.BOOK_DELETE_REQUEST);
    yield fork(deleteBook, action);
  }
}

export function* addBook({ data }) {
  try {
    const [method, generatePath] = endpoints.CREATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath(emptyObject),
      JSONToFormData(data),
    );
    yield put(successAddBook(cleanApiObject(response.data.data)));
    yield call(fetchBooks);
  } catch (e) {
    console.log(e);
    yield put(failureAddBook(e));
  }
}

export function* onAddBook() {
  while (true) {
    const action = yield take(types.BOOK_ADD_REQUEST);
    yield fork(addBook, action);
  }
}

export function* editBook({ id, data }) {
  try {
    const [method, generatePath] = endpoints.UPDATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath({ id }),
      JSONToFormData(data),
    );
    yield put(successEditBook(cleanApiObject(response.data.data)));
    yield call(fetchBooks);
  } catch (e) {
    console.log(e);
    yield put(failureEditBook(e, id));
  }
}

export function* onEditBook() {
  while (true) {
    const action = yield take(types.BOOK_EDIT_REQUEST);
    yield fork(editBook, action);
  }
}