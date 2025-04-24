import { createAction, props } from '@ngrx/store';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

export const fetchUserRemindersForToday = createAction(
  '[Medicine] Fetch User Reminders For Today From API',
  props<{ userId: number }>()
);

export const fetchUserRemindersForTodaySuccess = createAction(
  '[Medicine] Fetch User Reminders For Today From API Success',
  props<{ reminders: ReminderDTO[] }>()
);

export const fetchUserRemindersForTodayError = createAction(
  '[Medicine] Fetch User Reminders For Today From API Error',
  props<{ error: string }>()
);
