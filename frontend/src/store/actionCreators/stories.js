import types from 'store/actionTypes';
import { cleanApiObjects } from 'helpers/util';

export const requestStories = () => ({
  type: types.STORIES_REQUEST,
});

export const successStories = stories => ({
  type: types.STORIES_SUCCESS,
  stories: stories.map(s => ({
    ...s,
    characters: cleanApiObjects(s.characters.data),
    secondaryCharacters: cleanApiObjects(s.secondaryCharacters.data),
  })),
});

export const failureStories = exception => ({
  type: types.STORIES_FAILURE,
  exception,
});

export const resetStory = () => ({
  type: types.STORY_RESET,
});

export const updateStory = (param, value) => ({
  type: types.STORY_UPDATE,
  param,
  value,
});

export const requestFetchStory = id => ({
  type: types.STORY_FETCH_REQUEST,
  id,
});

export const successFetchStory = (id, data) => ({
  type: types.STORY_FETCH_SUCCESS,
  id,
  data: {
    ...data,
    characters: data.characters.data.map(c => c.id),
    secondaryCharacters: data.secondaryCharacters.data.map(c => c.id),
  },
});

export const failureFetchStory = (exception, id) => ({
  type: types.STORY_FETCH_FAILURE,
  exception,
  id,
});

export const requestAddStory = data => ({
  type: types.STORY_ADD_REQUEST,
  data,
});

export const successAddStory = data => ({
  type: types.STORY_ADD_SUCCESS,
  data,
});

export const failureAddStory = exception => ({
  type: types.STORY_ADD_FAILURE,
  exception,
});

export const requestEditStory = (id, data) => ({
  type: types.STORY_EDIT_REQUEST,
  id,
  data,
});

export const successEditStory = (id, data) => ({
  type: types.STORY_EDIT_SUCCESS,
  id,
  data,
});

export const failureEditStory = (exception, id) => ({
  type: types.STORY_EDIT_FAILURE,
  exception,
  id,
});

export const requestDeleteStory = id => ({
  type: types.STORY_DELETE_REQUEST,
  id,
});

export const successDeleteStory = id => ({
  type: types.STORY_DELETE_SUCCESS,
  id,
});

export const failureDeleteStory = (exception, id) => ({
  type: types.STORY_DELETE_FAILURE,
  exception,
  id,
});
