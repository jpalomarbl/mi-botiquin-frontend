import { createReducer, on } from '@ngrx/store';

import { MedicineStateDTO } from 'src/app/Models/medicineState.dto';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';

export const initialState: MedicineStateDTO = {
  medicineKits: [],
  reminders: [],
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
      reminders: reminders,
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
  }))
);
