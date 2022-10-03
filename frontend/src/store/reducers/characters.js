import types from 'store/actionTypes';

const initialValue = { data: [], loading: false };

const characters = (state = initialValue, action) => {
  switch (action.type) {
    case types.CHARACTERS_REQUEST: {
      return { ...state, loading: true };
    } case types.CHARACTERS_SUCCESS: {
      return {
        ...state,
        loading: false,
        data: action.characters.map(c => ({ ...c, roles: c.profession_tags.data.map(pt => pt.id )})),
    };
    } case types.CHARACTERS_FAILURE: {
      return initialValue;
    } case types.CHARACTER_DELETE_SUCCESS: {
      const { id } = action;
      return { ...state, data: state.data.filter(p => p.id !== id) };
    } default:
      return state;
  }
};

export default characters;
