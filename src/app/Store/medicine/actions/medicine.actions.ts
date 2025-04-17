import { createAction, props } from '@ngrx/store';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

export const fetchUserRemindersForToday = createAction(
  '[Medicine] Get User Reminders For Today',
  props<{ userId: number }>()
);

export const fetchUserRemindersForTodaySuccess = createAction(
  '[Medicine] Get User Reminders For Today Success',
  props<{ reminders: ReminderDTO[] }>()
);

export const fetchUserRemindersForTodayError = createAction(
  '[Medicine] Get User Reminders For Today Error',
  props<{ error: string }>()
);
