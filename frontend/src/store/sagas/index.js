import { all, call } from 'redux-saga/effects';
import { watchAuthentication, watchTokenExpiration, watchLogout } from 'store/sagas/authentication';
import {
  fetchPeriods,
  onFetchPeriods,
  onFetchPeriod,
  onDeletePeriod,
  onAddPeriod,
  onEditPeriod,
} from 'store/sagas/periods';
import {
  fetchCharacters,
  onFetchCharacters,
  onFetchCharacter,
  onDeleteCharacter,
  onAddCharacter,
  onEditCharacter,
} from 'store/sagas/characters';
import {
  fetchStories,
  onFetchStories,
  onFetchStory,
  onDeleteStory,
  onAddStory,
  onEditStory,
} from 'store/sagas/stories';
import {
  fetchEvents,
  onFetchEvents,
  onFetchEvent,
  onDeleteEvent,
  onAddEvent,
  onEditEvent,
} from 'store/sagas/events';
import {
  fetchBooks,
  onFetchBooks,
  onFetchBook,
  onDeleteBook,
  onAddBook,
  onEditBook,
} from 'store/sagas/books';

function* rootSaga() {
  yield all([
    call(watchAuthentication),
    call(watchTokenExpiration),
    call(watchLogout),
    call(fetchPeriods),
    call(onFetchPeriods),
    call(onFetchPeriod),
    call(onDeletePeriod),
    call(onAddPeriod),
    call(onEditPeriod),
    call(fetchCharacters),
    call(onFetchCharacters),
    call(onFetchCharacter),
    call(onDeleteCharacter),
    call(onAddCharacter),
    call(onEditCharacter),
    call(fetchStories),
    call(onFetchStories),
    call(onFetchStory),
    call(onDeleteStory),
    call(onAddStory),
    call(onEditStory),
    call(fetchEvents),
    call(onFetchEvents),
    call(onFetchEvent),
    call(onDeleteEvent),
    call(onAddEvent),
    call(onEditEvent),
    call(fetchBooks),
    call(onFetchBooks),
    call(onFetchBook),
    call(onDeleteBook),
    call(onAddBook),
    call(onEditBook),
  ]);
}

export default rootSaga;
