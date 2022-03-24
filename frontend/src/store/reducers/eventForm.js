import types from 'store/actionTypes';

const initialValue = {
  name: '',
  fromDate: '100001',
  endDate: '100001',
  showTimeOnSite: false,
  age: '',
  quote: '',
  summary: '',
  location: '',
  references: '',
  path: 1,
  color: '#ffffff',
  shortDescription: '',
  links: '',
  characters: [],
  media: [],
};

const eventForm = (state = initialValue, action) => {
  switch (action.type) {
    case types.EVENT_RESET: {
      return initialValue;
    } case types.EVENT_UPDATE: {
      return { ...state, [action.param]: action.value };
    } case types.EVENT_FETCH_SUCCESS: {
      return action.data;
    } default:
      return state;
  }
};

export default eventForm;
