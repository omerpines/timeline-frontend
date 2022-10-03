import types from 'store/actionTypes';

export const requestProfessions = () => ({
  type: types.PROFESSIONS_REQUEST,
});

export const successProfessions = professions => ({
  type: types.PROFESSIONS_SUCCESS,
  professions,
});

export const failureProfessions = exception => ({
  type: types.PROFESSIONS_FAILURE,
  exception,
});

export const requestAddProfession = data => ({
  type: types.PROFESSION_ADD_REQUEST,
  data,
});

export const successAddProfession = data => ({
  type: types.PROFESSION_ADD_SUCCESS,
  data,
});

export const failureAddProfession = exception => ({
  type: types.PROFESSION_ADD_FAILURE,
  exception,
});

export const requestDeleteProfession = id => ({
  type: types.PROFESSION_DELETE_REQUEST,
  id,
});

export const successDeleteProfession = id => ({
  type: types.PROFESSION_DELETE_SUCCESS,
  id,
});

export const failureDeleteProfession = (exception, id) => ({
  type: types.PROFESSION_DELETE_FAILURE,
  exception,
  id,
});
