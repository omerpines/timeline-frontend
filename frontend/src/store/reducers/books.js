import types from 'store/actionTypes';

const initialValue = { data: [], loading: false };

const books = (state = initialValue, action) => {
  switch (action.type) {
    case types.BOOKS_REQUEST: {
      return { ...state, loading: true };
    } case types.BOOKS_SUCCESS: {
      return { ...state, data: action.books, loading: false };
    } case types.BOOKS_FAILURE: {
      return initialValue;
    } case types.BOOK_DELETE_SUCCESS: {
      const { id } = action;
      return { ...state, data: state.data.filter(b => b.id !== id) };
    } default:
      return state;
  }
};

export default books;
