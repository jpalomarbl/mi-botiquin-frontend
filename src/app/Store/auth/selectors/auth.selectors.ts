import { createSelector } from '@ngrx/store';
import { AuthStateDTO } from '../../../Models/auth.dto';

export const selectAuthState = (state: AuthStateDTO) => state;

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
  selectAuthLoaded,
  (state: AuthStateDTO) => (state.loaded ? state.user : null)
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.error
);
