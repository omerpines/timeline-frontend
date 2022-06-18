import { createSelector } from 'reselect';

const csv = state => state.csv;

export const isCSVLoading = createSelector(
  csv,
  c => c.loading,
);

export const isCSVSucceed = createSelector(
  csv,
  c => c.success,
);

export const isCSVInvalid = createSelector(
  csv,
  c => c.errors.length > 0,
);

export const getCSVErrors = createSelector(
  csv,
  c => c.errors,
);
