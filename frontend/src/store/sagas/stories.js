import { take, fork, call, put } from 'redux-saga/effects';
import { callApi, callAuthenticatedApi } from 'store/sagas/callApi';
import types from 'store/actionTypes';
import {
  resetStory,
  successStories,
  failureStories,
  successFetchStory,
  failureFetchStory,
  successDeleteStory,
  failureDeleteStory,
  successAddStory,
  failureAddStory,
  successEditStory,
  failureEditStory,
} from 'store/actionCreators/stories';
import { compilePath, cleanApiObject, cleanApiObjects, JSONToFormData } from "helpers/util";

const emptyObject = {};

const endpoints = {
  'FETCH_ALL': ['GET', compilePath('/api/stories')],
  'FETCH': ['GET', compilePath('/api/stories/:id')],
  'CREATE': ['POST', compilePath('/api/stories')],
  'UPDATE': ['PUT', compilePath('/api/stories/:id')],
  'DELETE': ['DELETE', compilePath('/api/stories/:id')],
};

export function* fetchStories() {
  try {
    const [method, generatePath] = endpoints.FETCH_ALL;
    const response = yield call(callApi, method, generatePath(emptyObject), { populate: '*' });
    yield put(successStories(cleanApiObjects(response.data.data)));
  } catch (e) {
    yield put(failureStories(e));
  }
}

export function* onFetchStories() {
  while (true) {
    yield take(types.STORIES_REQUEST);
    yield fork(fetchStories);
  }
}

export function* fetchStory({ id }) {
  try {
    yield put(resetStory());
    const [method, generatePath] = endpoints.FETCH;
    const response = yield call(callAuthenticatedApi, method, generatePath({ id }), { populate: '*' });
    yield put(successFetchStory(id, cleanApiObject(response.data.data)));
  } catch (e) {
    yield put(failureFetchStory(e, id));
  }
}

export function* onFetchStory() {
  while (true) {
    const action = yield take(types.STORY_FETCH_REQUEST);
    yield fork(fetchStory, action);
  }
}

export function* deleteStory({ id }) {
  try {
    const [method, generatePath] = endpoints.DELETE;
    yield call(callAuthenticatedApi, method, generatePath({ id }), {});
    yield put(successDeleteStory(id));
    yield call(fetchStories);
  } catch (e) {
    yield put(failureDeleteStory(e, id));
  }
}

export function* onDeleteStory() {
  while (true) {
    const action = yield take(types.STORY_DELETE_REQUEST);
    yield fork(deleteStory, action);
  }
}

export function* addStory({ data }) {
  try {
    const [method, generatePath] = endpoints.CREATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath(emptyObject),
      JSONToFormData(data),
    );
    yield put(successAddStory(cleanApiObject(response.data.data)));
    yield call(fetchStories);
  } catch (e) {
    yield put(failureAddStory(e));
  }
}

export function* onAddStory() {
  while (true) {
    const action = yield take(types.STORY_ADD_REQUEST);
    yield fork(addStory, action);
  }
}

export function* editStory({ id, data }) {
  try {
    const [method, generatePath] = endpoints.UPDATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath({ id }),
      JSONToFormData(data),
    );
    yield put(successEditStory(cleanApiObject(response.data.data)));
    yield call(fetchStories);
  } catch (e) {
    yield put(failureEditStory(e, id));
  }
}

export function* onEditStory() {
  while (true) {
    const action = yield take(types.STORY_EDIT_REQUEST);
    yield fork(editStory, action);
  }
}
