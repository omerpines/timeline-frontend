import types from 'store/actionTypes';

const initialValue = { authenticated: false, error: false, loading: false, data: null };

const authentication = (state = initialValue, action) => {
  switch (action.type) {
    case types.AUTHENTICATION_REQUEST:
      return { ...state, loading: true };
    case types.AUTHENTICATION_SUCCESS:
      return { ...initialValue, loading: false, authenticated: true, data: action.data };
    case types.AUTHENTICATION_FAILURE:
      return { ...initialValue, error: action.exception };
    case types.AUTHENTICATION_DATA_SUCCESS:
      return { ...state, data: { ...state.data, ...action.data } };
    case types.AUTHENTICATION_LOGOUT:
      return initialValue;
    default:
      return state;
  }
};

export default authentication;
