import { createReducer, on } from '@ngrx/store';

import { MedicineStateDTO } from 'src/app/Models/medicineState.dto';
import * as MedicineActions from '../actions/medicine.actions';

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
  on(MedicineActions.getUserRemindersForToday, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(MedicineActions.getUserRemindersForTodaySuccess, (state, { reminders }) => ({
    ...state,
    reminders: reminders,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(MedicineActions.getUserRemindersForTodayError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),
);
