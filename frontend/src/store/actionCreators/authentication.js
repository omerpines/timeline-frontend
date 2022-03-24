import types from 'store/actionTypes';

export const requestAuthentication = (username, password) => ({
  type: types.AUTHENTICATION_REQUEST,
  username,
  password,
});

export const successAuthentication = data => ({
  type: types.AUTHENTICATION_SUCCESS,
  data,
});

export const failureAuthentication = exception => ({
  type: types.AUTHENTICATION_FAILURE,
  exception,
});

export const logoutAuthentication = () => ({
  type: types.AUTHENTICATION_LOGOUT,
});

export const requestAuthenticationData = () => ({
  type: types.AUTHENTICATION_DATA_REQUEST,
});

export const successAuthenticationData = data => ({
  type: types.AUTHENTICATION_DATA_SUCCESS,
  data,
});

export const failureAuthenticationData = exception => ({
  type: types.AUTHENTICATION_DATA_FAILURE,
  exception,
});
