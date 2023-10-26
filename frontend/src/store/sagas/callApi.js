import { select, call, put } from 'redux-saga/effects';
import axios from 'axios';
import config from 'constants/config';
import { logoutAuthentication } from 'store/actionCreators/authentication';
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

function* processMediaQueries(data) {
  const { media } = data;
  const newMedia = [];
  
  const token = yield select(getToken);
  const tokenHeader = { Authorization: `Bearer ${token}` };

  for (let i = 0, l = media.length; i < l; i += 1) {
    const m = media[i];

    if (m.type !== 'newImage' && m.type !== 'newVideo' && m.type !== 'newAudio') {
      newMedia.push(m);
      continue;
    }

    const formData = new FormData();
    formData.append('files', m.file);

    const response = yield call(axios, {
      method: 'POST',
      url: `${config.API}/api/upload`,
      data: formData,
      headers: tokenHeader,
    });

    const url = `${config.API}${response.data[0].url}`;
    // const smallUrl = type === 'image' && response.data[0].formats ? `${config.API}${response.data[0].formats.small.url}` : null;

    let type = 'image';
    if (m.type === 'newVideo') type = 'video';
    else if (m.type === 'newAudio') type = 'audio';

    newMedia.push({
      type,
      url,
      id: m.id,
      title: m.title,
      description: m.description,
      isInternal: true,
      toDelete: false,
    });
  }

  return { ...data, media: newMedia };
}

export function* callAuthenticatedApi(method, url, iData, head) {
  let pData = iData;
  if (iData.media && (method === 'POST' || method === 'PUT')) {
    pData = yield call(processMediaQueries, iData);
  }

  const params = method === 'GET' ? pData : undefined;
  let data   = method === 'GET' ? undefined : pData;

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

  if (response.status === 401) {
    window.localStorage.removeItem('auth');
    yield put(logoutAuthentication());
  }

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
