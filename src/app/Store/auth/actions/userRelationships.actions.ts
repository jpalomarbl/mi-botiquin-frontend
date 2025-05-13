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
