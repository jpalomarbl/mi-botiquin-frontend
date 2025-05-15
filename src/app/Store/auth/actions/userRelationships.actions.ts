import { createAction, props } from '@ngrx/store';
import { UserDTO } from 'src/app/Models/user.dto';

export const fetchPatientRelationships = createAction(
  '[Auth] Fetch Patient Relationships From API',
  props<{ userId: number }>()
);

export const fetchPatientRelationshipsSuccess = createAction(
  '[Auth] Fetch Patient Relationships From API Success',
  props<{ relationships: UserDTO[] }>()
);

export const fetchPatientRelationshipsError = createAction(
  '[Auth] Fetch Patient Relationships From API Error',
  props<{ error: string }>()
);

export const fetchCaretakerRelationships = createAction(
  '[Auth] Fetch Caretaker Relationships From API',
  props<{ userId: number }>()
);

export const fetchCaretakerRelationshipsSuccess = createAction(
  '[Auth] Fetch Caretaker Relationships From API Success',
  props<{ relationships: UserDTO[] }>()
);

export const fetchCaretakerRelationshipsError = createAction(
  '[Auth] Fetch Caretaker Relationships From API Error',
  props<{ error: string }>()
);

export const fetchFamilyMemberRelationships = createAction(
  '[Auth] Fetch Family Member Relationships From API',
  props<{ userId: number }>()
);

export const fetchFamilyMemberRelationshipsSuccess = createAction(
  '[Auth] Fetch Family Member Relationships From API Success',
  props<{ relationships: UserDTO[] }>()
);

export const fetchFamilyMemberRelationshipsError = createAction(
  '[Auth] Fetch Family Member Relationships From API Error',
  props<{ error: string }>()
);

export const searchUsers = createAction(
  '[Auth] Search Users From API',
  props<{ searchTerm: string }>()
);

export const searchUsersSuccess = createAction(
  '[Auth] Search Users From API Success',
  props<{ searchResults: UserDTO[] }>()
);

export const searchUsersError = createAction(
  '[Auth] Search Users From API Error',
  props<{ error: string }>()
);

export const acceptRelationshipRequest = createAction(
  '[Auth] Accept Relationship Request and insert relatinoship in DB',
  props<{ requesterId: number, receiverId: number, requesterRole: string }>()
);

export const acceptRelationshipRequestSuccess = createAction(
  '[Auth] Accept Relationship Request and insert relatinoship in DB Success',
  props<{ relationship: UserDTO }>()
);

export const acceptRelationshipRequestError = createAction(
  '[Auth] Accept Relationship Request and insert relatinoship in DB Error',
  props<{ error: string }>()
);
