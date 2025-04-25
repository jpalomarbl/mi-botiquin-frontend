import { createAction, props } from '@ngrx/store';
import { UserRelationshipDTO } from 'src/app/Models/userRelaitonship.dto';

export const fetchCaretakerRelationships = createAction(
  '[Auth] Fetch Caretaker Relationships From API',
  props<{ userId: number }>()
);

export const fetchCaretakerRelationshipsSuccess = createAction(
  '[Auth] Fetch Caretaker Relationships From API Success',
  props<{ reminders: UserRelationshipDTO[] }>()
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
  props<{ reminders: UserRelationshipDTO[] }>()
);

export const fetchFamilyMemberRelationshipsError = createAction(
  '[Auth] Fetch Family Member Relationships From API Error',
  props<{ error: string }>()
);
