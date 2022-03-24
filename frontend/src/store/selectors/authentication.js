import { createSelector } from 'reselect';

export const authentication = state => state.authentication;

export const isAuthenticated = createSelector(
  authentication,
  a => a.authenticated,
);

export const isAuthenticationLoading = createSelector(
  authentication,
  a => a.loading,
);

export const getUserData = createSelector(
  authentication,
  a => a.data,
);

export const getAuthenticationError = createSelector(
  authentication,
  a => a.error,
);

export const getToken = createSelector(
  getUserData,
  d => d ? d.jwt : null,
);
