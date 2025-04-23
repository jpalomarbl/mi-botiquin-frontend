import { createReducer, on } from '@ngrx/store';
import { AuthStateDTO } from 'src/app/Models/authState.dto';
import * as AuthActions from '../actions/auth.actions';

export const initialState: AuthStateDTO = {
  user: null,
  loading: false,
  loaded: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(AuthActions.loginOAuth, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user: user,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(AuthActions.loginError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(AuthActions.registerError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(AuthActions.logoutSuccess, (state) => initialState),
  on(AuthActions.logoutError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  on(AuthActions.checkSession, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(AuthActions.checkSessionSuccess, (state, { user }) => ({
    ...state,
    user: user,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(AuthActions.checkSessionError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  }))
);
