import { createAction, props } from '@ngrx/store';
import {
  expirationNotificationDTO,
  relationshipRequestNotificationDTO,
} from 'src/app/Models/notification.dto';
export const fetchUserUnreadNotifications = createAction(
  '[Auth] Fetch Users Unread Notifications From API',
  props<{ userId: number }>()
);

export const fetchCaretakerRelationshipsSuccess = createAction(
  '[Auth] Fetch Users Unread Notifications From API Success',
  props<{
    notifications: Array<
      expirationNotificationDTO | relationshipRequestNotificationDTO
    >;
  }>()
);

export const fetchCaretakerRelationshipsError = createAction(
  '[Auth] Fetch Users Unread Notifications From API Error',
  props<{ error: string }>()
);

export const sendRelationshipRequest = createAction(
  '[Auth] Send User Relationship Request to API',
  props<{ requesterId: number; receiverId: number }>()
);

export const sendRelationshipRequestSuccess = createAction(
  '[Auth] Fetch Users Unread Notifications From API Success'
);

export const sendRelationshipRequestError = createAction(
  '[Auth] Fetch Users Unread Notifications From API Error',
  props<{ error: string }>()
);

export const addNotification = createAction(
  '[Auth] Add Notification to User',
  props<{ notification: expirationNotificationDTO }>()
);
