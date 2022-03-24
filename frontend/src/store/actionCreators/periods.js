import types from 'store/actionTypes';

export const requestPeriods = () => ({
  type: types.PERIODS_REQUEST,
});

export const successPeriods = periods => ({
  type: types.PERIODS_SUCCESS,
  periods,
});

export const failurePeriods = exception => ({
  type: types.PERIODS_FAILURE,
  exception,
});

export const resetPeriod = () => ({
  type: types.PERIOD_RESET,
});

export const updatePeriod = (param, value) => ({
  type: types.PERIOD_UPDATE,
  param,
  value,
});

export const requestFetchPeriod = id => ({
  type: types.PERIOD_FETCH_REQUEST,
  id,
});

export const successFetchPeriod = (id, data) => ({
  type: types.PERIOD_FETCH_SUCCESS,
  id,
  data,
});

export const failureFetchPeriod = (exception, id) => ({
  type: types.PERIOD_FETCH_FAILURE,
  exception,
  id,
});

export const requestAddPeriod = data => ({
  type: types.PERIOD_ADD_REQUEST,
  data,
});

export const successAddPeriod = data => ({
  type: types.PERIOD_ADD_SUCCESS,
  data,
});

export const failureAddPeriod = exception => ({
  type: types.PERIOD_ADD_FAILURE,
  exception,
});

export const requestEditPeriod = (id, data) => ({
  type: types.PERIOD_EDIT_REQUEST,
  id,
  data,
});

export const successEditPeriod = (id, data) => ({
  type: types.PERIOD_EDIT_SUCCESS,
  id,
  data,
});

export const failureEditPeriod = (exception, id) => ({
  type: types.PERIOD_EDIT_FAILURE,
  exception,
  id,
});

export const requestDeletePeriod = id => ({
  type: types.PERIOD_DELETE_REQUEST,
  id,
});

export const successDeletePeriod = id => ({
  type: types.PERIOD_DELETE_SUCCESS,
  id,
});

export const failureDeletePeriod = (exception, id) => ({
  type: types.PERIOD_DELETE_FAILURE,
  exception,
  id,
});
