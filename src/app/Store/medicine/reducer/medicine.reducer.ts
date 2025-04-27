import { createReducer, on } from '@ngrx/store';

import { MedicineStateDTO } from 'src/app/Models/medicineState.dto';
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
  // on(
  //   reminderActions.fetchAllUserConsumptionsSuccess,
  //   (state, { consumptions }) => ({
  //     ...state,
  //     loading: false,
  //     loaded: true,
  //     error: null,
  //   })
  // ),
  // on(reminderActions.fetchAllUserConsumptionsError, (state, { error }) => ({
  //   ...state,
  //   loading: false,
  //   loaded: true,
  //   error: error,
  // })),

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
  }))
);
