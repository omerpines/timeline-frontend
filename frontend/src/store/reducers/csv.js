import types from 'store/actionTypes';

const initialValue = {
  errors: [],
  loading: false,
  success: false,
};

const csv = (state = initialValue, action) => {
  switch (action.type) {
    case types.CSV_RESET: return initialValue;
    case types.CSV_SUCCESS: return { ...initialValue, success: true };
    case types.CSV_LOADING: return { ...initialValue, loading: false };
    case types.CSV_FAILURE: return { ...initialValue, errors: action.errors };
    default: return state;
  }
};

export default csv;
