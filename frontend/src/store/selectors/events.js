import { createSelector } from 'reselect';

export const events = state => state.events;

export const isEventsLoading = createSelector(
  events,
  state => state.loading,
);

export const getEvents = createSelector(
  events,
  state => state.data,
);
