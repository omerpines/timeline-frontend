import types from 'store/actionTypes';

export const requestCharacters = () => ({
  type: types.CHARACTERS_REQUEST,
});

export const successCharacters = characters => ({
  type: types.CHARACTERS_SUCCESS,
  characters,
});

export const failureCharacters = exception => ({
  type: types.CHARACTERS_FAILURE,
  exception,
});

export const resetCharacter = () => ({
  type: types.CHARACTER_RESET,
});

export const updateCharacter = (param, value) => ({
  type: types.CHARACTER_UPDATE,
  param,
  value,
});

export const requestFetchCharacter = id => ({
  type: types.CHARACTER_FETCH_REQUEST,
  id,
});

export const successFetchCharacter = (id, data) => ({
  type: types.CHARACTER_FETCH_SUCCESS,
  id,
  data,
});

export const failureFetchCharacter = (exception, id) => ({
  type: types.CHARACTER_FETCH_FAILURE,
  exception,
  id,
});

export const requestAddCharacter = data => ({
  type: types.CHARACTER_ADD_REQUEST,
  data,
});

export const successAddCharacter = data => ({
  type: types.CHARACTER_ADD_SUCCESS,
  data,
});

export const failureAddCharacter = exception => ({
  type: types.CHARACTER_ADD_FAILURE,
  exception,
});

export const requestEditCharacter = (id, data) => ({
  type: types.CHARACTER_EDIT_REQUEST,
  id,
  data,
});

export const successEditCharacter = (id, data) => ({
  type: types.CHARACTER_EDIT_SUCCESS,
  id,
  data,
});

export const failureEditCharacter = (exception, id) => ({
  type: types.CHARACTER_EDIT_FAILURE,
  exception,
  id,
});

export const requestDeleteCharacter = id => ({
  type: types.CHARACTER_DELETE_REQUEST,
  id,
});

export const successDeleteCharacter = id => ({
  type: types.CHARACTER_DELETE_SUCCESS,
  id,
});

export const failureDeleteCharacter = (exception, id) => ({
  type: types.CHARACTER_DELETE_FAILURE,
  exception,
  id,
});
