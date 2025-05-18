import { createAction, props } from '@ngrx/store';
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

export const fetchUserMedicineKits = createAction(
  '[Medicine] Fetch User Medicine Kits From API',
  props<{ userId: number; role: string }>()
);

export const fetchUserMedicineKitsSuccess = createAction(
  '[Medicine] Fetch User Medicine Kits From API Success',
  props<{ medicineKits: MedicineKitDTO[] }>()
);

export const fetchUserMedicineKitsError = createAction(
  '[Medicine] Fetch User Medicine Kits From API Error',
  props<{ error: string }>()
);

export const fetchMedicineKitById = createAction(
  '[Medicine] Fetch Medicine Kit By ID From API',
  props<{ medicineKitId: number }>()
);

export const fetchMedicineKitByIdSuccess = createAction(
  '[Medicine] Fetch Medicine Kit By ID From API Success',
  props<{ medicineKit: MedicineKitDTO }>()
);

export const fetchMedicineKitByIdError = createAction(
  '[Medicine] Fetch Medicine Kit By ID From API Error',
  props<{ error: string }>()
);

export const deleteMedicineById = createAction(
  '[Medicine] Delete Medicine By Id',
  props<{ medicineId: number; medicineKitId: number }>()
);

export const deleteMedicineByIdSuccess = createAction(
  '[Medicine] Delete Medicine By Id Success',
  props<{ medicineId: number; medicineKitId: number }>()
);

export const deleteMedicineByIdError = createAction(
  '[Medicine] Delete Medicine By Id Error',
  props<{ error: string }>()
);

export const addMedicineKit = createAction(
  '[Medicine] Insert Medicine Kit',
  props<{ medicineKit: MedicineKitDTO }>()
);

export const addMedicineKitSuccess = createAction(
  '[Medicine] Insert Medicine Kit Success'
);

export const addMedicineKitError = createAction(
  '[Medicine] Insert Medicine Kit Error',
  props<{ error: string }>()
);

export const fetchMedicinesCIMA = createAction(
  '[Medicine] Fetch Medicines From CIMA REST API',
  props<{ medicineName: string }>()
);

export const fetchMedicinesCIMASuccess = createAction(
  '[Medicine] Fetch Medicines From CIMA REST API Success',
  props<{ medicines: MedicineDTO[] }>()
);

export const fetchMedicinesCIMAError = createAction(
  '[Medicine] Fetch Medicines From CIMA REST API Error',
  props<{ error: string }>()
);

export const addMedicine = createAction(
  '[Medicine] Insert medicine into DB',
  props<{
    medicine: MedicineDTO;
    reminder?: ReminderDTO;
    medicineKitId: number;
  }>()
);

export const addMedicineSuccess = createAction(
  '[Medicine] Insert medicine into DB Success',
  props<{
    medicine: MedicineDTO;
    reminder?: ReminderDTO;
    medicineKitId: number;
  }>()
);

export const addMedicineError = createAction(
  '[Medicine] Insert medicine into DB Error',
  props<{ error: string }>()
);

export const updateMedicine = createAction(
  '[Medicine] Update medicine from DB',
  props<{
    medicine: MedicineDTO;
    reminder?: ReminderDTO;
    medicineKitId: number;
    createReminder: boolean;
  }>()
);

export const updateMedicineSuccess = createAction(
  '[Medicine] Update medicine from DB Success',
  props<{
    medicine: MedicineDTO;
    reminder?: ReminderDTO;
    medicineKitId: number;
  }>()
);

export const updateMedicineError = createAction(
  '[Medicine] Update medicine from DB Error',
  props<{ error: string }>()
);
