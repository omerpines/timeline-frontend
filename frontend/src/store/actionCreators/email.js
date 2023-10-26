import types from 'store/actionTypes';

export const requestEmail = (name, email, message, content, close) => ({
  type: types.EMAIL_REQUEST,
  name,
  email,
  message,
  content,
  close,
});

export const successEmail = () => ({
  type: types.EMAIL_SUCCESS,
});

export const failureEmail = exception => ({
  type: types.EMAIL_FAILURE,
  exception,
});
