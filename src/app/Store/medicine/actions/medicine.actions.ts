import { createAction, props } from '@ngrx/store';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';

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

export const fetchUserMedicineKits = createAction(
  '[Medicine] Fetch User Medicine Kits From API',
  props<{ userId: number, role: string }>()
);

export const fetchUserMedicineKitsSuccess = createAction(
  '[Medicine] Fetch User Medicine Kits From API Success',
  props<{ medicineKits: MedicineKitDTO[] }>()
);

export const fetchUserMedicineKitsError = createAction(
  '[Medicine] Fetch User Medicine Kits From API Error',
  props<{ error: string }>()
);
