import { take, fork, call, put } from 'redux-saga/effects';
import { callApi, callAuthenticatedApi } from 'store/sagas/callApi';
import types from 'store/actionTypes';
import {
  successProfessions,
  failureProfessions,
  successDeleteProfession,
  failureDeleteProfession,
  successAddProfession,
  failureAddProfession,
} from 'store/actionCreators/professions';
import { compilePath, cleanApiObject, cleanApiObjects, JSONToFormData } from "helpers/util";

const emptyObject = {};

const endpoints = {
  'FETCH_ALL': ['GET', compilePath('/api/profession-tags')],
  'CREATE': ['POST', compilePath('/api/profession-tags')],
  'DELETE': ['DELETE', compilePath('/api/profession-tags/:id')],
};

export function* fetchProfessions() {
  try {
    const [method, generatePath] = endpoints.FETCH_ALL;
    const response = yield call(callApi, method, generatePath(emptyObject), { populate: ['icon'] });
    yield put(successProfessions(cleanApiObjects(response.data.data)));
  } catch (e) {
    yield put(failureProfessions(e));
  }
}

export function* onFetchProfessions() {
  while (true) {
    yield take(types.PROFESSIONS_REQUEST);
    yield fork(fetchProfessions);
  }
}

export function* deleteProfession({ id }) {
  try {
    const [method, generatePath] = endpoints.DELETE;
    yield call(callAuthenticatedApi, method, generatePath({ id }), {});
    yield put(successDeleteProfession(id));
    yield call(fetchProfessions);
  } catch (e) {
    yield put(failureDeleteProfession(e, id));
  }
}

export function* onDeleteProfession() {
  while (true) {
    const action = yield take(types.PROFESSION_DELETE_REQUEST);
    yield fork(deleteProfession, action);
  }
}

export function* addProfession({ data }) {
  try {
    const [method, generatePath] = endpoints.CREATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath(emptyObject),
      JSONToFormData(data),
    );
    yield put(successAddProfession(cleanApiObject(response.data.data)));
    yield call(fetchProfessions);
  } catch (e) {
    yield put(failureAddProfession(e));
  }
}

export function* onAddProfession() {
  while (true) {
    const action = yield take(types.PROFESSION_ADD_REQUEST);
    yield fork(addProfession, action);
  }
}
