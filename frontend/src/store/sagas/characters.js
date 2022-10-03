import { take, fork, call, put } from 'redux-saga/effects';
import { callApi, callAuthenticatedApi } from 'store/sagas/callApi';
import types from 'store/actionTypes';
import {
  resetCharacter,
  successCharacters,
  failureCharacters,
  successFetchCharacter,
  failureFetchCharacter,
  successDeleteCharacter,
  failureDeleteCharacter,
  successAddCharacter,
  failureAddCharacter,
  successEditCharacter,
  failureEditCharacter,
} from 'store/actionCreators/characters';
import { compilePath, cleanApiObject, cleanApiObjects, JSONToFormData } from "helpers/util";

const emptyObject = {};

const endpoints = {
  'FETCH_ALL': ['GET', compilePath('/api/characters')],
  'FETCH': ['GET', compilePath('/api/characters/:id')],
  'CREATE': ['POST', compilePath('/api/characters')],
  'UPDATE': ['PUT', compilePath('/api/characters/:id')],
  'DELETE': ['DELETE', compilePath('/api/characters/:id')],
  'FETCH_RELATIONS': ['GET', compilePath('/api/character-relations')],
};

export function* fetchCharacters() {
  try {
    const [method, generatePath] = endpoints.FETCH_ALL;
    const response = yield call(callApi, method, generatePath(emptyObject), { populate: '*' });
    yield put(successCharacters(cleanApiObjects(response.data.data)));
  } catch (e) {
    console.log(e);
    yield put(failureCharacters(e));
  }
}

export function* onFetchCharacters() {
  while (true) {
    yield take(types.CHARACTERS_REQUEST);
    yield fork(fetchCharacters);
  }
}

export function* fetchCharacter({ id }) {
  try {
    yield put(resetCharacter());
    const [method, generatePath] = endpoints.FETCH;
    const [relMethod, relGeneratePath] = endpoints.FETCH_RELATIONS;

    const response = yield call(callAuthenticatedApi, method, generatePath({ id }), { populate: '*' });
    yield put(successFetchCharacter(id, cleanApiObject(response.data.data)));
  } catch (e) {
    yield put(failureFetchCharacter(e, id));
  }
}

export function* onFetchCharacter() {
  while (true) {
    const action = yield take(types.CHARACTER_FETCH_REQUEST);
    yield fork(fetchCharacter, action);
  }
}

export function* deleteCharacter({ id }) {
  try {
    const [method, generatePath] = endpoints.DELETE;
    yield call(callAuthenticatedApi, method, generatePath({ id }), {});
    yield put(successDeleteCharacter(id));
    yield call(fetchCharacters);
  } catch (e) {
    yield put(failureDeleteCharacter(e, id));
  }
}

export function* onDeleteCharacter() {
  while (true) {
    const action = yield take(types.CHARACTER_DELETE_REQUEST);
    yield fork(deleteCharacter, action);
  }
}

export function* addCharacter({ data }) {
  try {
    const [method, generatePath] = endpoints.CREATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath(emptyObject),
      JSONToFormData(data),
    );
    yield put(successAddCharacter(cleanApiObject(response.data.data)));
    yield call(fetchCharacters);
  } catch (e) {
    yield put(failureAddCharacter(e));
  }
}

export function* onAddCharacter() {
  while (true) {
    const action = yield take(types.CHARACTER_ADD_REQUEST);
    yield fork(addCharacter, action);
  }
}

export function* editCharacter({ id, data }) {
  try {
    const [method, generatePath] = endpoints.UPDATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath({ id }),
      JSONToFormData(data),
    );
    yield put(successEditCharacter(cleanApiObject(response.data.data)));
    yield call(fetchCharacters);
  } catch (e) {
    yield put(failureEditCharacter(e, id));
  }
}

export function* onEditCharacter() {
  while (true) {
    const action = yield take(types.CHARACTER_EDIT_REQUEST);
    yield fork(editCharacter, action);
  }
}
