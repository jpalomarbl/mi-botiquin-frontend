import { createSelector } from "@ngrx/store";
import { MedicineStateDTO } from "src/app/Models/medicineState.dto";
import { GlobalStateDTO } from "src/app/Models/globalState.dto";

export const selectMedicineState = (state: GlobalStateDTO) => state.medicine;

export const selectReminders = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.reminders
);

export const selectRemindersLoading = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.loading
);

export const selectRemindersLoaded = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.loaded
);

export const selectRemindersError = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.error
);
