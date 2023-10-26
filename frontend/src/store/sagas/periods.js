import { take, fork, call, put } from 'redux-saga/effects';
import { callApi, callAuthenticatedApi } from 'store/sagas/callApi';
import types from 'store/actionTypes';
import {
  resetPeriod,
  successPeriods,
  failurePeriods,
  successFetchPeriod,
  failureFetchPeriod,
  successDeletePeriod,
  failureDeletePeriod,
  successAddPeriod,
  failureAddPeriod,
  successEditPeriod,
  failureEditPeriod,
} from 'store/actionCreators/periods';
import { compilePath, cleanApiObject, cleanApiObjects, JSONToFormData } from "helpers/util";

const emptyObject = {};

const endpoints = {
  'FETCH_ALL': ['GET', compilePath('/api/periods')],
  'FETCH': ['GET', compilePath('/api/periods/:id')],
  'CREATE': ['POST', compilePath('/api/periods')],
  'UPDATE': ['PUT', compilePath('/api/periods/:id')],
  'DELETE': ['DELETE', compilePath('/api/periods/:id')],
};

export function* fetchPeriods() {
  try {
    const [method, generatePath] = endpoints.FETCH_ALL;
    const response = yield call(callApi, method, generatePath(emptyObject), { populate: 'image' });
    yield put(successPeriods(cleanApiObjects(response.data.data)));
  } catch (e) {
    yield put(failurePeriods(e));
  }
}

export function* onFetchPeriods() {
  while (true) {
    yield take(types.PERIODS_REQUEST);
    yield fork(fetchPeriods);
  }
}

export function* fetchPeriod({ id }) {
  try {
    yield put(resetPeriod());
    const [method, generatePath] = endpoints.FETCH;
    const response = yield call(callAuthenticatedApi, method, generatePath({ id }), { populate: '*' });
    yield put(successFetchPeriod(id, cleanApiObject(response.data.data)));
  } catch (e) {
    yield put(failureFetchPeriod(e, id));
  }
}

export function* onFetchPeriod() {
  while (true) {
    const action = yield take(types.PERIOD_FETCH_REQUEST);
    yield fork(fetchPeriod, action);
  }
}

export function* deletePeriod({ id }) {
  try {
    const [method, generatePath] = endpoints.DELETE;
    yield call(callAuthenticatedApi, method, generatePath({ id }), {});
    yield put(successDeletePeriod(id));
    yield call(fetchPeriods);
  } catch (e) {
    yield put(failureDeletePeriod(e, id));
  }
}

export function* onDeletePeriod() {
  while (true) {
    const action = yield take(types.PERIOD_DELETE_REQUEST);
    yield fork(deletePeriod, action);
  }
}

export function* addPeriod({ data }) {
  try {
    const [method, generatePath] = endpoints.CREATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath(emptyObject),
      JSONToFormData(data),
    );

    yield put(successAddPeriod(cleanApiObject(response.data.data)));
    yield call(fetchPeriods);
  } catch (e) {
    console.log(e);
    yield put(failureAddPeriod(e));
  }
}

export function* onAddPeriod() {
  while (true) {
    const action = yield take(types.PERIOD_ADD_REQUEST);
    yield fork(addPeriod, action);
  }
}

export function* editPeriod({ id, data }) {
  try {
    const [method, generatePath] = endpoints.UPDATE;
    const response = yield call(
      callAuthenticatedApi,
      method,
      generatePath({ id }),
      JSONToFormData(data),
    );
    yield put(successEditPeriod(cleanApiObject(response.data.data)));
    yield call(fetchPeriods);
  } catch (e) {
    console.log(e);
    yield put(failureEditPeriod(e, id));
  }
}

export function* onEditPeriod() {
  while (true) {
    const action = yield take(types.PERIOD_EDIT_REQUEST);
    yield fork(editPeriod, action);
  }
}