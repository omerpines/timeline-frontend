import { createSelector } from 'reselect';

export const periods = state => state.periods;

export const isPeriodsLoading = createSelector(
  periods,
  state => state.loading,
);

export const getPeriods = createSelector(
  periods,
  state => state.data,
);
