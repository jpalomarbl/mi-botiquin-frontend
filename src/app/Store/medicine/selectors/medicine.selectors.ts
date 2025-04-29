import { createSelector } from '@ngrx/store';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { MedicineStateDTO } from 'src/app/Models/medicineState.dto';

export const selectMedicineState = (state: GlobalStateDTO) => state.medicine;

export const selectReminders = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.reminders
);

export const selectOrganizedReminders = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.organizedReminders
);

export const selectMedicinesSearch = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.medicinesSearch
);

export const selectMedicineKits = createSelector(
  selectMedicineState,
  (state: MedicineStateDTO) => state.medicineKits
);

export const selectMedicineKitById = (medicineKitId: number) =>
  createSelector(
    selectMedicineKits,
    (medicineKits: MedicineKitDTO[]) => medicineKits.find((medicineKit) => medicineKit.id === medicineKitId)
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
