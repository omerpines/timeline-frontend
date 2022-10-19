import types from 'store/actionTypes';

const initialValue = {
  name: '',
  endDate: null,
  fromDate: null,
  showTimeOnSite: false,
  attribution: '',
  gender: 'male',
  area: '',
  nation: '',
  profession_tags: [],
  tags: '',
  image: null,
  summary: '',
  content: '',
  timeline: '',
  appearances: '',
  quote: '',
  characters: [],
  shortDescription: '',
  links: '',
  media: [],
};

const characterForm = (state = initialValue, action) => {
  switch (action.type) {
    case types.CHARACTER_RESET: {
      return initialValue;
    } case types.CHARACTER_UPDATE: {
      return { ...state, [action.param]: action.value };
    } case types.CHARACTER_FETCH_SUCCESS: {
      return {
        ...action.data,
        profession_tags: action.data.profession_tags.data.map(pt => pt.id),
      };
    } default:
      return state;
  }
};

export default characterForm;
