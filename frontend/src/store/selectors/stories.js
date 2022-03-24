import { createSelector } from 'reselect';

export const stories = state => state.stories;

export const isStoriesLoading = createSelector(
  stories,
  state => state.loading,
);

export const getStories = createSelector(
  stories,
  state => state.data,
);
