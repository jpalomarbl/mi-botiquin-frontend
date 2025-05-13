import { createReducer, on } from '@ngrx/store';
import { AuthStateDTO } from 'src/app/Models/authState.dto';
import * as AuthActions from '../actions/auth.actions';
import * as userRelationshipActions from '../actions/userRelationships.actions';
import * as notificationActions from '../actions/notification.actions';

export const initialState: AuthStateDTO = {
  user: null,
  usersSearchResults: null,
  relationships: null,
  notifications: null,
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

  // Check session
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
  })),

  // Update user
  on(AuthActions.updateUser, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(AuthActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(AuthActions.updateUserError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Fetch Patient relationships
  on(userRelationshipActions.fetchPatientRelationships, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(userRelationshipActions.fetchPatientRelationshipsSuccess, (state, { relationships }) => ({
    ...state,
    relationships: relationships,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(userRelationshipActions.fetchPatientRelationshipsError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Fetch caretaker relationships
  on(userRelationshipActions.fetchCaretakerRelationships, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(userRelationshipActions.fetchCaretakerRelationshipsSuccess, (state, { relationships }) => ({
    ...state,
    relationships: relationships,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(userRelationshipActions.fetchCaretakerRelationshipsError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Fetch family member relationships
  on(userRelationshipActions.fetchFamilyMemberRelationships, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(userRelationshipActions.fetchFamilyMemberRelationshipsSuccess, (state, { relationships }) => ({
    ...state,
    relationships: relationships,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(userRelationshipActions.fetchFamilyMemberRelationshipsError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Fetch user's unread notifications
  on(notificationActions.fetchUserUnreadNotifications, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(notificationActions.fetchCaretakerRelationshipsSuccess, (state, { notifications }) => ({
    ...state,
    notifications: notifications,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(notificationActions.fetchCaretakerRelationshipsError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),
);
