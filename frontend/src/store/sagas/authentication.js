import { take, fork, put, call } from 'redux-saga/effects';
import axios from 'axios';
import { getAuthenticatedApi } from 'store/sagas/callApi';
import {
  successAuthentication,
  failureAuthentication,
  successAuthenticationData,
  failureAuthenticationData,
} from 'store/actionCreators/authentication';
import config from 'constants/config';
import types from 'store/actionTypes';

function* processAuthenticationDataRequest() {
  try {
    const response = yield call(getAuthenticatedApi, '/api/users/me', { populate: '*' });
    yield put(successAuthenticationData(response.data));
  } catch (e) {
    yield put(failureAuthenticationData(e));
  }
}

function* processAuthenticationRequest({ username, password }) {
  try {
    const params = {
      password,
      identifier: username,
    };
    const response = yield call(axios.post, `${config.API}/api/auth/local`, params);
    const data = { jwt: response.data.jwt, ...response.data.user };
    yield put(successAuthentication(data));
    window.localStorage.setItem('auth', JSON.stringify(data));
    yield call(processAuthenticationDataRequest);
  } catch (e) {
    yield put(failureAuthentication(e.response.data.error));
  }
}

export function* watchAuthentication() {
  const auth = window.localStorage.getItem('auth');
  if (auth) {
    yield put(successAuthentication(JSON.parse(auth)));
    yield fork(processAuthenticationDataRequest);
  }

  while (true) {
    const action = yield take(types.AUTHENTICATION_REQUEST);
    yield fork(processAuthenticationRequest, action);
  }
}

export function* watchLogout() {
  while (true) {
    yield take(types.AUTHENTICATION_LOGOUT);
    window.localStorage.removeItem('auth');
  }
}
