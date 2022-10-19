import types from 'store/actionTypes';

const initialValue = {
  name: '',
  color: '#FFFFFF',
  description: '',
  endDate: null,
  fromDate: null,
  majorEvents: '',
  image: null,
  showTimeOnSite: false,
  shortDescription: '',
  links: '',
  media: [],
};

const periodForm = (state = initialValue, action) => {
  switch (action.type) {
    case types.PERIOD_RESET: {
      return initialValue;
    } case types.PERIOD_UPDATE: {
      return { ...state, [action.param]: action.value };
    } case types.PERIOD_FETCH_SUCCESS: {
      return action.data;
    } default:
      return state;
  }
};

export default periodForm;
