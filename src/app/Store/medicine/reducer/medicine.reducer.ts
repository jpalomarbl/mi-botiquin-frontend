import { createReducer, on } from '@ngrx/store';

import { MedicineStateDTO } from 'src/app/Models/medicineState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';

export const initialState: MedicineStateDTO = {
  medicineKits: [],
  reminders: [],
  organizedReminders: [],
  loading: false,
  loaded: false,
  error: null,
};

export const medicineReducer = createReducer(
  initialState,

  // Get all reminders for today
  on(reminderActions.fetchUserRemindersForToday, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    reminderActions.fetchUserRemindersForTodaySuccess,
    (state, { reminders }) => ({
      ...state,
      reminders: reminders ? [...state.reminders, ...reminders] : state.reminders,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(reminderActions.fetchUserRemindersForTodayError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Get all reminders from user
  on(reminderActions.fetchAllUserReminders, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    reminderActions.fetchAllUserRemindersSuccess,
    (state, { reminders, organizedReminders }) => ({
      ...state,
      reminders: reminders,
      organizedReminders: organizedReminders,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(reminderActions.fetchAllUserRemindersError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  on(reminderActions.fetchAllUserConsumptions, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),

  // Mark reminder as consumed
  on(
    reminderActions.changeReminderState,
    (state, { index, reminderId, time, status }) => {
      // Validación de índice
      if (index < 0 || index >= state.organizedReminders.length) {
        return state;
      }

      // Copia inmutable del array
      const updatedReminders = state.organizedReminders.map((pair, i) => {
        if (i !== index) return pair; // Mantener los demás elementos

        // Modificar solo el elemento en el índice dado
        return [
          pair![0], // Conservar la Date
          [[pair![1][0][0], !status]] as [ReminderDTO, boolean][], // Actualizar el booleano
        ] as [Date, [ReminderDTO, boolean][]];
      });

      return {
        ...state,
        organizedReminders: updatedReminders,
        loading: true,
        loaded: false,
        error: null,
      };
    }
  ),
  on(reminderActions.changeReminderStateSuccess, (state) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(reminderActions.changeReminderStateError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Get all medicine kits from user
  on(medicineKitActions.fetchUserMedicineKits, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    medicineKitActions.fetchUserMedicineKitsSuccess,
    (state, { medicineKits }) => ({
      ...state,
      medicineKits: medicineKits,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(medicineKitActions.fetchUserMedicineKitsError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Get all medicine kits from user
  on(medicineKitActions.fetchMedicineKitById, (state, { medicineKitId }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    medicineKitActions.fetchMedicineKitByIdSuccess,
    (state, { medicineKit }) => {

      // Validación de índice
      const newIndex = state.medicineKits.findIndex(
        (medicineKitItem) => medicineKitItem.id === medicineKit.id
      );

      if (newIndex < 0) {
        return {
          ...state,
          medicineKits: [...state.medicineKits, medicineKit],
        };
      }

      // Copia inmutable del array
      const updatedMedicineKits = state.medicineKits.map(
        (medicineKitItem, i) => {
          if (i !== newIndex) return medicineKitItem; // Mantener los demás elementos

          // Actualiza solo el elemento en el índice dado
          return medicineKit;
        }
      );

      return {
        ...state,
        medicineKits: updatedMedicineKits,
        loading: true,
        loaded: false,
        error: null,
      };
    }
  ),
  on(medicineKitActions.fetchMedicineKitByIdError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Delete a medicine
  on(medicineKitActions.deleteMedicineById, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    medicineKitActions.deleteMedicineByIdSuccess,
    (state) => ({
      ...state,
      loading: false,
      loaded: true,
      error: null,
    })
  ),
  on(medicineKitActions.deleteMedicineByIdError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),
);
