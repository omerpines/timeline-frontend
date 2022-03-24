import types from 'store/actionTypes';

const initialValue = { data: [], loading: false };

const stories = (state = initialValue, action) => {
  switch (action.type) {
    case types.STORIES_REQUEST: {
      return { ...state, loading: true };
    } case types.STORIES_SUCCESS: {
      return { ...state, data: action.stories, loading: false };
    } case types.STORIES_FAILURE: {
      return initialValue;
    } case types.STORY_DELETE_SUCCESS: {
      const { id } = action;
      return { ...state, data: state.data.filter(s => s.id !== id) };
    } default:
      return state;
  }
};

export default stories;
