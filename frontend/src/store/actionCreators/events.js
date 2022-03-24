import types from 'store/actionTypes';
import { relationToId } from 'helpers/util';

export const requestEvents = () => ({
  type: types.EVENTS_REQUEST,
});

export const successEvents = periods => ({
  type: types.EVENTS_SUCCESS,
  periods,
});

export const failureEvents = exception => ({
  type: types.EVENTS_FAILURE,
  exception,
});

export const resetEvent = () => ({
  type: types.EVENT_RESET,
});

export const updateEvent = (param, value) => ({
  type: types.EVENT_UPDATE,
  param,
  value,
});

export const requestFetchEvent = id => ({
  type: types.EVENT_FETCH_REQUEST,
  id,
});

export const successFetchEvent = (id, data) => ({
  type: types.EVENT_FETCH_SUCCESS,
  id,
  data,
});

export const failureFetchEvent = (exception, id) => ({
  type: types.EVENT_FETCH_FAILURE,
  exception,
  id,
});

export const requestAddEvent = data => ({
  type: types.EVENT_ADD_REQUEST,
  data,
});

export const successAddEvent = data => ({
  type: types.EVENT_ADD_SUCCESS,
  data,
});

export const failureAddEvent = exception => ({
  type: types.EVENT_ADD_FAILURE,
  exception,
});

export const requestEditEvent = (id, data) => ({
  type: types.EVENT_EDIT_REQUEST,
  id,
  data,
});

export const successEditEvent = (id, data) => ({
  type: types.EVENT_EDIT_SUCCESS,
  id,
  data,
});

export const failureEditEvent = (exception, id) => ({
  type: types.EVENT_EDIT_FAILURE,
  exception,
  id,
});

export const requestDeleteEvent = id => ({
  type: types.EVENT_DELETE_REQUEST,
  id,
});

export const successDeleteEvent = id => ({
  type: types.EVENT_DELETE_SUCCESS,
  id,
});

export const failureDeleteEvent = (exception, id) => ({
  type: types.EVENT_DELETE_FAILURE,
  exception,
  id,
});
