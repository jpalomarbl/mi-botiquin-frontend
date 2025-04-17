import { createAction, props } from '@ngrx/store';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

export const getUserRemindersForToday = createAction(
  '[Medicine] Get User Reminders For Today',
  props<{ userId: number }>()
);

export const getUserRemindersForTodaySuccess = createAction(
  '[Medicine] Get User Reminders For Today Success',
  props<{ reminders: ReminderDTO[] }>()
);

export const getUserRemindersForTodayError = createAction(
  '[Medicine] Get User Reminders For Today Error',
  props<{ error: string }>()
);
