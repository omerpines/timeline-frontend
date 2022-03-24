import types from 'store/actionTypes';

const initialValue = { data: [], loading: false };

const periods = (state = initialValue, action) => {
  switch (action.type) {
    case types.PERIODS_REQUEST: {
      return { ...state, loading: true };
    } case types.PERIODS_SUCCESS: {
      return { ...state, data: action.periods, loading: false };
    } case types.PERIODS_FAILURE: {
      return initialValue;
    } case types.PERIOD_DELETE_SUCCESS: {
      const { id } = action;
      return { ...state, data: state.data.filter(p => p.id !== id) };
    } default:
      return state;
  }
};

export default periods;
