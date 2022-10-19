import types from 'store/actionTypes';

const initialValue = {
  name: '',
  endDate: null,
  fromDate: null,
  showTimeOnSite: false,
  geographic: '',
  age: '',
  location: '',
  summary: '',
  content: '',
  period: null,
  characters: [],
  background: null,
  picture: null,
  tags: '',
  shortDescription: '',
  links: '',
  media: [],
};

const bookForm = (state = initialValue, action) => {
  switch (action.type) {
    case types.BOOK_RESET: {
      return initialValue;
    } case types.BOOK_UPDATE: {
      return { ...state, [action.param]: action.value };
    } case types.BOOK_FETCH_SUCCESS: {
      return action.data;
    } default:
      return state;
  }
};

export default bookForm;
