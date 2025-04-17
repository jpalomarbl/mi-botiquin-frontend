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
  selectAuthLoaded,
  (state: AuthStateDTO) => state.user
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.error
);
