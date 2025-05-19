import { createReducer, on } from '@ngrx/store';
import { AuthStateDTO } from 'src/app/Models/authState.dto';
import * as AuthActions from '../actions/auth.actions';
import * as notificationActions from '../actions/notification.actions';
import * as userRelationshipActions from '../actions/userRelationships.actions';

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
  on(
    userRelationshipActions.fetchPatientRelationshipsSuccess,
    (state, { relationships }) => ({
      ...state,
      relationships: relationships,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(
    userRelationshipActions.fetchPatientRelationshipsError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Fetch caretaker relationships
  on(userRelationshipActions.fetchCaretakerRelationships, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    userRelationshipActions.fetchCaretakerRelationshipsSuccess,
    (state, { relationships }) => ({
      ...state,
      relationships: relationships,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(
    userRelationshipActions.fetchCaretakerRelationshipsError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Fetch family member relationships
  on(userRelationshipActions.fetchFamilyMemberRelationships, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    userRelationshipActions.fetchFamilyMemberRelationshipsSuccess,
    (state, { relationships }) => ({
      ...state,
      relationships: relationships,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(
    userRelationshipActions.fetchFamilyMemberRelationshipsError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Search for users on DB
  on(userRelationshipActions.searchUsers, (state, { searchTerm }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    userRelationshipActions.searchUsersSuccess,
    (state, { searchResults }) => ({
      ...state,
      usersSearchResults: searchResults,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(userRelationshipActions.searchUsersError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Accept relationship request
  on(
    userRelationshipActions.acceptRelationshipRequest,
    (state, { requesterId, receiverId, requesterRole }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    userRelationshipActions.acceptRelationshipRequestSuccess,
    (state, { relationship }) => ({
      ...state,
      relationships: [...(state.relationships || []), relationship],
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(
    userRelationshipActions.acceptRelationshipRequestError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Remove patient-caretaker relationship
  on(
    userRelationshipActions.removePatientCaretakerRelationship,
    (state, { patientId, caretakerId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    userRelationshipActions.removePatientCaretakerRelationshipSuccess,
    (state, { caretakerId }) => {
      let findIndex = -1;
      const relationships = [...(state.relationships || [])];

      if (relationships.length > 0) {
        findIndex = relationships.findIndex(
          (relationship) => relationship.id === caretakerId
        );
      }

      if (findIndex === -1) {
        return {
          ...state,
          loading: false,
          loaded: true,
          error: null,
        };
      } else {
        return {
          ...state,
          relationships: relationships.slice(findIndex, 1),
          loading: false,
          loaded: true,
          error: null,
        };
      }
    }
  ),
  on(
    userRelationshipActions.removePatientCaretakerRelationshipError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Remove patient-familyMember relationship
  on(
    userRelationshipActions.removePatientFamilyMemberRelationship,
    (state, { patientId, familyMemberId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    userRelationshipActions.removePatientFamilyMemberRelationshipSuccess,
    (state, { familyMemberId }) => {
      let findIndex = -1;
      const relationships = [...(state.relationships || [])];

      if (relationships.length > 0) {
        findIndex = relationships.findIndex(
          (relationship) => relationship.id === familyMemberId
        );
      }

      if (findIndex === -1) {
        return {
          ...state,
          loading: false,
          loaded: true,
          error: null,
        };
      } else {
        return {
          ...state,
          relationships: relationships.slice(findIndex, 1),
          loading: false,
          loaded: true,
          error: null,
        };
      }
    }
  ),
  on(
    userRelationshipActions.removePatientFamilyMemberRelationshipError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Fetch user's unread notifications
  on(notificationActions.fetchUserUnreadNotifications, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    notificationActions.fetchCaretakerRelationshipsSuccess,
    (state, { notifications }) => ({
      ...state,
      notifications: notifications,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(
    notificationActions.fetchCaretakerRelationshipsError,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: true,
      error: error,
    })
  ),

  // Send relationship request
  on(
    notificationActions.sendRelationshipRequest,
    (state, { requesterId, receiverId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(notificationActions.sendRelationshipRequestSuccess, (state) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(notificationActions.sendRelationshipRequestError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Add new notification
  on(notificationActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [...(state.notifications || []), notification],
    loading: false,
    loaded: true,
    error: null,
  })),

  // Add new notification
  on(notificationActions.removeNotification, (state, { notification }) => ({
    ...state,
    notifications:
      state.notifications?.filter(
        (notificationItem) =>
          // Mantenemos solo las notificaciones que NO coincidan con la que queremos eliminar
          !(
            notificationItem.id1 === notification.id1 &&
            notificationItem.id2 === notification.id2 &&
            notificationItem.type === notification.type
          )
      ) ?? null, // Si notifications es undefined, devolvemos null
    loading: false,
    loaded: true,
    error: null,
  }))
);
