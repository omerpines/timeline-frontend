import types from 'store/actionTypes';

export const requestEmail = (name, email, message, close) => ({
  type: types.EMAIL_REQUEST,
  name,
  email,
  message,
  close,
});

export const successEmail = () => ({
  type: types.EMAIL_SUCCESS,
});

export const failureEmail = exception => ({
  type: types.EMAIL_FAILURE,
  exception,
});
