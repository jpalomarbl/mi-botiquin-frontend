import { createAction, props } from '@ngrx/store';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';

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

export const fetchMedicineKitById = createAction(
  '[Medicine] Fetch Medicine Kit By ID From API',
  props<{ medicineKitId: number }>()
);

export const fetchMedicineKitsByIdSuccess = createAction(
  '[Medicine] Fetch User Medicine Kits From API Success',
  props<{ medicineKit: MedicineKitDTO }>()
);

export const fetchMedicineKitsByIdError = createAction(
  '[Medicine] Fetch User Medicine Kits From API Error',
  props<{ error: string }>()
);
