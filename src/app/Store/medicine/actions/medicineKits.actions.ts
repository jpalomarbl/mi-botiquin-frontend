import { createAction, props } from '@ngrx/store';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';

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
  props<{ medicineId: number, medicineKitId: number }>()
);

export const deleteMedicineByIdSuccess = createAction(
  '[Medicine] Delete Medicine By Id Success'
);

export const deleteMedicineByIdError = createAction(
  '[Medicine] Delete Medicine By Id',
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
