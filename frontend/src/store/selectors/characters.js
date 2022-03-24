import { createSelector } from 'reselect';

export const characters = state => state.characters;

export const isCharactersLoading = createSelector(
  characters,
  state => state.loading,
);

export const getCharacters = createSelector(
  characters,
  state => state.data,
);
