import { createSelector } from 'reselect';

export const professions = state => state.professions;

export const isProfessionsLoading = createSelector(
  professions,
  state => state.loading,
);

export const getProfessions = createSelector(
  professions,
  state => state.data,
);
