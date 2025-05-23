import { createAction, props } from '@ngrx/store';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { organizedRemindersObject } from 'src/app/Models/medicineState.dto';

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
    organizedReminders: Array<[Date, [ReminderDTO, organizedRemindersObject][]] | null>;
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
  props<{
    reminder: ReminderDTO;
    time: Date;
    status: boolean;
    increase: boolean;
    halfConsumption?: boolean;
  }>()
);

export const changeReminderStateSuccess = createAction(
  '[Medicine] Mark Reminder As Consumed Success',
  props<{ reminder: ReminderDTO; time: Date }>()
);

export const changeReminderStateError = createAction(
  '[Medicine] Mark Reminder As Consumed Error',
  props<{ error: string }>()
);

export const addReminder = createAction(
  '[Medicine] Insert reminder into DB',
  props<{ reminder: ReminderDTO; medicineId: number; medicineKitId: number }>()
);

export const addReminderSuccess = createAction(
  '[Medicine] Insert reminder into DB Success',
  props<{ reminder: ReminderDTO; medicineId: number; medicineKitId: number }>()
);

export const addReminderError = createAction(
  '[Medicine] Insert reminder into DB Error',
  props<{ error: string }>()
);

export const updateReminder = createAction(
  '[Medicine] Update reminder from DB',
  props<{ reminder: ReminderDTO; medicineId: number; medicineKitId: number }>()
);

export const updateReminderSuccess = createAction(
  '[Medicine] Update reminder from DB Success',
  props<{ reminder: ReminderDTO; medicineId: number; medicineKitId: number }>()
);

export const updateReminderError = createAction(
  '[Medicine] Update reminder from DB Error',
  props<{ error: string }>()
);

export const deleteReminder = createAction(
  '[Medicine] Delete reminder from DB',
  props<{ reminderId: number; medicineId: number; medicineKitId: number }>()
);

export const deleteReminderSucess = createAction(
  '[Medicine] Delete reminder from DB Success',
  props<{ reminderId: number; medicineId: number; medicineKitId: number }>()
);

export const deleteReminderError = createAction(
  '[Medicine] Delete reminder from DB Error',
  props<{ error: string }>()
);
