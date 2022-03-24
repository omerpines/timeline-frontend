import { take, fork, call, put } from 'redux-saga/effects';
import { callApi, callAuthenticatedApi } from 'store/sagas/callApi';
import types from 'store/actionTypes';
import {
  resetEvent,
  successEvents,
  failureEvents,
  successFetchEvent,
  failureFetchEvent,
  successDeleteEvent,
  failureDeleteEvent,
  successAddEvent,
  failureAddEvent,
  successEditEvent,
  failureEditEvent,
} from 'store/actionCreators/events';
import { compilePath, cleanApiObject, cleanApiObjects, JSONToFormData } from "helpers/util";

const emptyObject = {};

const endpoints = {
  'FETCH_ALL': ['GET', compilePath('/api/events')],
  'FETCH': ['GET', compilePath('/api/events/:id')],
  'CREATE': ['POST', compilePath('/api/events')],
  'UPDATE': ['PUT', compilePath('/api/events/:id')],
  'DELETE': ['DELETE', compilePath('/api/events/:id')],
};

export function* fetchEvents() {
  try {
    const [method, generatePath] = endpoints.FETCH_ALL;
    const response = yield call(callApi, method, generatePath(emptyObject), { populate: '*' });
    yield put(successEvents(cleanApiObjects(response.data.data)));
  } catch (e) {
    yield put(failureEvents(e));
  }
}

export function* onFetchEvents() {
  while (true) {
    yield take(types.EVENTS_REQUEST);
    yield fork(fetchEvents);
  }
}

export function* fetchEvent({ id }) {
  try {
    yield put(resetEvent());
    const [method, generatePath] = endpoints.FETCH;
    const response = yield call(callAuthenticatedApi, method, generatePath({ id }), { populate: '*' });
    yield put(successFetchEvent(id, cleanApiObject(response.data.data)));
  } catch (e) {
    yield put(failureFetchEvent(e, id));
  }
}

export function* onFetchEvent() {
  while (true) {
    const action = yield take(types.EVENT_FETCH_REQUEST);
    yield fork(fetchEvent, action);
  }
}

export function* deleteEvent({ id }) {
  try {
    const [method, generatePath] = endpoints.DELETE;
    yield call(callAuthenticatedApi, method, generatePath({ id }), {});
    yield put(successDeleteEvent(id));
    yield call(fetchEvents);
  } catch (e) {
    yield put(failureDeleteEvent(e, id));
  }
}

export function* onDeleteEvent() {
  while (true) {
    const action = yield take(types.EVENT_DELETE_REQUEST);
    yield fork(deleteEvent, action);
  }
}

export function* addEvent({ data }) {
  try {
    const [method, generatePath] = endpoints.CREATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath(emptyObject),
      JSONToFormData(data),
    );
    yield put(successAddEvent(cleanApiObject(response.data.data)));
    yield call(fetchEvents);
  } catch (e) {
    yield put(failureAddEvent(e));
  }
}

export function* onAddEvent() {
  while (true) {
    const action = yield take(types.EVENT_ADD_REQUEST);
    yield fork(addEvent, action);
  }
}

export function* editEvent({ id, data }) {
  try {
    const [method, generatePath] = endpoints.UPDATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath({ id }),
      JSONToFormData(data),
    );
    yield put(successEditEvent(cleanApiObject(response.data.data)));
    yield call(fetchEvents);
  } catch (e) {
    yield put(failureEditEvent(e, id));
  }
}

export function* onEditEvent() {
  while (true) {
    const action = yield take(types.EVENT_EDIT_REQUEST);
    yield fork(editEvent, action);
  }
}
