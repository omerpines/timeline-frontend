import { select, call } from 'redux-saga/effects';
import axios from 'axios';
import config from 'constants/config';
import { getToken } from 'store/selectors/authentication';
import { prepareApiObject } from 'helpers/util';

const emptyHeaders = {};

export function* callApi(method, url, iData, headers) {
  const params = method === 'GET' ? iData : undefined;
  let data   = method === 'GET' ? undefined : iData;

  if (data instanceof FormData) headers['Content-Type'] = 'multipart/form-data';
  else if (data) data = prepareApiObject(data);
  const response = yield call(axios, {
    method,
    url,
    data,
    params,
    headers: headers || emptyHeaders,
    baseURL: config.API,
  });
  return response;
}

export function* callAuthenticatedApi(method, url, iData, head) {
  const params = method === 'GET' ? iData : undefined;
  let data   = method === 'GET' ? undefined : iData;

  const token = yield select(getToken);
  const tokenHeader = { Authorization: `Bearer ${token}` };
  const headers = head ? { ...head, ...tokenHeader } : tokenHeader;
  if (data instanceof FormData) headers['Content-Type'] = 'multipart/form-data';
  else if (data) data = prepareApiObject(data);
  const response = yield call(axios, {
    method,
    url,
    data,
    params,
    headers,
    baseURL: config.API,
  });
  return response;
}

export function* getAuthenticatedApi(url, data, head) {
  const response = yield call(callAuthenticatedApi, 'GET', url, data, head);
  return response;
}

export function* getApi(url, data, head) {
  const response = yield call(callApi, 'GET', url, data, head);
  return response;
}
