import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthStateDTO } from '../models/auth.dto';

export const selectAuthState = createFeatureSelector<AuthStateDTO>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.loading
);

export const selectAuthLoaded = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.loaded
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthStateDTO) => state.error
);
