import { createSelector } from '@ngrx/store';
import { AuthStateDTO } from 'src/app/Models/authState.dto';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';

export const selectAuthState = (state: GlobalStateDTO) => state.auth;

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.loading
);

export const selectAuthLoaded = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.loaded
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.user
);

export const selectUserRelationships = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.relationships
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.error
);

export const selectUserNotifications = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.notifications
);

export const selectUserSearchResults = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.usersSearchResults
);
