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

export const fetchAllUserReminders = createAction(
  '[Medicine] Fetch All User Reminders From API',
  props<{ userId: number, day: Date }>()
);

export const fetchAllUserRemindersSuccess = createAction(
  '[Medicine] Fetch All User Reminders From API Success',
  props<{ organizedReminders:  Array<[Date, ReminderDTO[]] | null>, reminders: ReminderDTO[] }>()
);

export const fetchAllUserRemindersError = createAction(
  '[Medicine] Fetch All User Reminders From API Error',
  props<{ error: string }>()
);

export const fetchAllUserConsumptions = createAction(
  '[Medicine] Fetch All User Consumptions From API',
  props<{ userId: number, day: Date }>()
);

export const fetchAllUserConsumptionsSuccess = createAction(
  '[Medicine] Fetch All User Consumptions From API Success',
  props<{ consumptions: Array<[number, Date]> }>()
);

export const fetchAllUserConsumptionsError = createAction(
  '[Medicine] Fetch All User Consumptions From API Error',
  props<{ error: string }>()
);
