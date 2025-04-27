import { createSelector } from "@ngrx/store";
import { MedicineStateDTO } from "src/app/Models/medicineState.dto";
import { GlobalStateDTO } from "src/app/Models/globalState.dto";

export const selectMedicineState = (state: GlobalStateDTO) => state.medicine;

export const selectReminders = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.reminders
);

export const selectOrganizedReminders = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.organizedReminders
);

export const selectMedicineKits = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.medicineKits
);

export const selectMedicineLoading = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.loading
);

export const selectMedicineLoaded = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.loaded
);

export const selectMedicineError = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.error
);
