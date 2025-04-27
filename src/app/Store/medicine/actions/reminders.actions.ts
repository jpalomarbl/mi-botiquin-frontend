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
  props<{ userId: number; day: Date }>()
);

export const fetchAllUserRemindersSuccess = createAction(
  '[Medicine] Fetch All User Reminders From API Success',
  props<{
    organizedReminders: Array<[Date, [ReminderDTO, boolean][]] | null>;
    reminders: ReminderDTO[];
  }>()
);

export const fetchAllUserRemindersError = createAction(
  '[Medicine] Fetch All User Reminders From API Error',
  props<{ error: string }>()
);

export const fetchAllUserConsumptions = createAction(
  '[Medicine] Fetch All User Consumptions From API',
  props<{ userId: number; reminders: ReminderDTO[]; day: Date }>()
);

export const changeReminderState = createAction(
  '[Medicine] Mark Reminder As Consumed/To Be Consumed',
  props<{ index: number, reminderId: number, time: Date, status: boolean }>()
);

export const changeReminderStateSuccess = createAction(
  '[Medicine] Mark Reminder As Consumed Success',
);

export const changeReminderStateError = createAction(
  '[Medicine] Mark Reminder As Consumed Success',
  props<{ error: string }>()
);
