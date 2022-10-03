import types from 'store/actionTypes';

const initialValue = { data: [], loading: false };

const professions = (state = initialValue, action) => {
  switch (action.type) {
    case types.PROFESSIONS_REQUEST: {
      return { ...state, loading: true };
    } case types.PROFESSIONS_SUCCESS: {
      return { ...state, data: action.professions, loading: false };
    } case types.PROFESSIONS_FAILURE: {
      return initialValue;
    } case types.PROFESSION_DELETE_SUCCESS: {
      const { id } = action;
      return { ...state, data: state.data.filter(e => e.id !== id) };
    } default:
      return state;
  }
};

export default professions;
