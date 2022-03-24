import types from 'store/actionTypes';

const initialValue = { data: [], loading: false };

const events = (state = initialValue, action) => {
  switch (action.type) {
    case types.EVENTS_REQUEST: {
      return { ...state, loading: true };
    } case types.EVENTS_SUCCESS: {
      return { ...state, data: action.periods, loading: false };
    } case types.EVENTS_FAILURE: {
      return initialValue;
    } case types.EVENT_DELETE_SUCCESS: {
      const { id } = action;
      return { ...state, data: state.data.filter(e => e.id !== id) };
    } default:
      return state;
  }
};

export default events;
