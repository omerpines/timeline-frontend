import types from 'store/actionTypes';

const initialValue = {
  name: '',
  endDate: null,
  fromDate: null,
  showTimeOnSite: false,
  age: '',
  summary: '',
  plot: '',
  references: '',
  location: '',
  path: 1,
  color: '#ffffff',
  characters: [],
  secondaryCharacters: [],
  tags: '',
  quote: '',
  book: null,
  links: '',
  shortDescription: '',
  media: [],
};

const storyForm = (state = initialValue, action) => {
  switch (action.type) {
    case types.STORY_RESET: {
      return initialValue;
    } case types.STORY_UPDATE: {
      return { ...state, [action.param]: action.value };
    } case types.STORY_FETCH_SUCCESS: {
      return action.data;
    } default:
      return state;
  }
};

export default storyForm;
