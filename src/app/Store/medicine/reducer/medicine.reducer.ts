import { createReducer, on } from '@ngrx/store';

import { MedicineStateDTO } from 'src/app/Models/medicineState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import * as reminderActions from 'src/app/Store/medicine/actions/reminder.actions';

export const initialState: MedicineStateDTO = {
  medicineKits: [],
  reminders: [],
  organizedReminders: [],
  medicinesSearch: [],
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
      reminders: reminders
        ? [...(state.reminders || []), ...reminders]
        : state.reminders,
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
    reminders: [],
    organizedReminders: [],
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    reminderActions.fetchAllUserRemindersSuccess,
    (state, { reminders, organizedReminders }) => {
      return {
        ...state,
        reminders: reminders,
        organizedReminders: organizedReminders,
        loading: false,
        loaded: true,
        error: null,
      };
    }
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
    (state, { reminder, time, status }) => {
      return {
        ...state,
        loading: true,
        loaded: false,
        error: null,
      };
    }
  ),
  on(
    reminderActions.changeReminderStateSuccess,
    (state, { reminder, time }) => {
      const updatedReminders: Array<[Date, [ReminderDTO, boolean][]] | null> =
        state.organizedReminders.map(
          (pair: [Date, [ReminderDTO, boolean][]] | null, i) => {
            if (pair![0].getTime() === time.getTime()) {
              return [
                pair![0],
                pair![1].map((reminderPair: [ReminderDTO, boolean]) => {
                  if (reminderPair[0].id === reminder.id) {
                    return [reminderPair[0], !reminderPair[1]];
                  } else {
                    return reminderPair;
                  }
                }),
              ];
            } else return pair;
          }
        );

      return {
        ...state,
        organizedReminders: updatedReminders,
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),
  on(reminderActions.changeReminderStateError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Add reminder to DB
  on(reminderActions.addReminder, (state, { reminder, medicineId }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(
    reminderActions.addReminderSuccess,
    (state, { reminder, medicineId, medicineKitId }) => {
      let medicineName: string = '';
      let medicineKitName: string = '';
      let medicineUnit: string = '';

      return {
        ...state,
        medicineKits: state.medicineKits.map((medicineKit) => {
          if (medicineKit.id === medicineKitId) {
            medicineKitName = medicineKit.name;

            return {
              ...medicineKit,
              medicines: medicineKit.medicines.map((medicine) => {
                if (medicine.id === medicineId) {
                  medicineName = medicine.name;
                  medicineUnit = medicine.unit;

                  return {
                    ...medicine,
                    reminder: reminder,
                  };
                } else return medicine;
              }),
            };
          } else return medicineKit;
        }),
        reminders: [
          ...(state.reminders || []),
          {
            ...reminder,
            medicineUnit: medicineUnit,
            medicineName: medicineName,
            medicineKitName: medicineKitName,
          },
        ],
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),
  on(reminderActions.addReminderError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Update reminder to DB
  on(
    reminderActions.updateReminder,
    (state, { reminder, medicineId, medicineKitId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    reminderActions.updateReminderSuccess,
    (state, { reminder, medicineId, medicineKitId }) => {
      let medicineName: string = '';
      let medicineKitName: string = '';
      let medicineUnit: string = '';

      const updatedMedicineKits = state.medicineKits.map((medicineKit) => {
        if (medicineKit.id !== medicineKitId) {
          return medicineKit;
        }

        medicineKitName = medicineKit.name;

        const updatedMedicines = medicineKit.medicines.map((medicine) => {
          if (medicine.id !== medicineId) {
            return medicine;
          }

          medicineName = medicine.name;
          medicineUnit = medicine.unit;

          return {
            ...medicine,
            reminder: reminder,
          };
        });

        return {
          ...medicineKit,
          medicines: updatedMedicines,
        };
      });

      return {
        ...state,
        medicineKits: updatedMedicineKits,
        reminders: state.reminders.map((reminderItem) =>
          reminderItem.id === reminder.id
            ? {
                ...reminder,
                medicineUnit: medicineUnit,
                medicineName: medicineName,
                medicineKitName: medicineKitName,
              }
            : reminderItem
        ),
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),

  on(reminderActions.updateReminderError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Delete reminder from DB
  on(
    reminderActions.deleteReminder,
    (state, { reminderId, medicineId, medicineKitId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    reminderActions.deleteReminderSucess,
    (state, { reminderId, medicineId, medicineKitId }) => {
      const updatedMedicineKits = state.medicineKits.map((medicineKit) => {
        if (medicineKit.id !== medicineKitId) {
          return medicineKit;
        }

        const updatedMedicines = medicineKit.medicines.map((medicine) => {
          if (medicine.id !== medicineId) {
            return medicine;
          }
          return {
            ...medicine,
            reminder: null,
          };
        });

        return {
          ...medicineKit,
          medicines: updatedMedicines,
        };
      });

      return {
        ...state,
        medicineKits: updatedMedicineKits,
        reminders: state.reminders.filter(
          (reminder) => reminder.id !== reminderId
        ),
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),

  on(reminderActions.updateReminderError, (state, { error }) => ({
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
          medicineKits: [...(state.medicineKits || []), medicineKit],
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
  on(medicineKitActions.deleteMedicineById, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(
    medicineKitActions.deleteMedicineByIdSuccess,
    (state, { medicineId, medicineKitId }) => ({
      ...state,
      medicineKits: state.medicineKits.map((kit) =>
        kit.id !== medicineKitId
          ? kit
          : {
              ...kit,
              medicines: kit.medicines.filter((m) => m.id !== medicineId),
            }
      ),
      loading: false,
      loaded: true,
      error: null,
    })
  ),

  on(medicineKitActions.deleteMedicineByIdError, (state, { error }) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: error,
    };
  }),

  // Add new mediicne kit
  on(medicineKitActions.addMedicineKit, (state, { medicineKit }) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(medicineKitActions.addMedicineKitSuccess, (state, { medicineKit }) => ({
    ...state,
    medicineKits: [...(state.medicineKits || []), medicineKit],
    loading: false,
    loaded: true,
    error: null,
  })),
  on(medicineKitActions.addMedicineKitError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Delete mediicne kit
  on(medicineKitActions.deleteMedicineKit, (state, { medicineKitId }) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(
    medicineKitActions.deleteMedicineKitSuccess,
    (state, { medicineKitId }) => {
      if (state.reminders) {
        let deletedReminders: ReminderDTO[] = [];

        state.medicineKits.forEach((medicineKit) => {
          if (medicineKit.id === medicineKitId) {
            medicineKit.medicines.forEach((medicine) => {
              if (medicine.reminder) deletedReminders.push(medicine.reminder);
            });
          }
        });

        return {
          ...state,
          medicineKits: state.medicineKits.filter(
            (item) => item.id !== medicineKitId
          ),
          reminders: state.reminders.filter(
            (stateReminder: ReminderDTO) =>
              !deletedReminders.some(
                (deletedReminder: ReminderDTO) =>
                  deletedReminder.id === stateReminder.id
              )
          ),
          loading: false,
          loaded: true,
          error: null,
        };
      } else {
        return {
          ...state,
          medicineKits: state.medicineKits.filter(
            (item) => item.id !== medicineKitId
          ),
          loading: false,
          loaded: true,
          error: null,
        };
      }
    }
  ),
  on(medicineKitActions.deleteMedicineKitError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Fetch medicines from CIMA REST API
  on(medicineKitActions.fetchMedicinesCIMA, (state, { medicineName }) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null,
  })),
  on(medicineKitActions.fetchMedicinesCIMASuccess, (state, { medicines }) => ({
    ...state,
    medicinesSearch: medicines,
    loading: false,
    loaded: true,
    error: null,
  })),
  on(medicineKitActions.fetchMedicinesCIMAError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Add new medicine to medicine kit
  on(
    medicineKitActions.addMedicine,
    (state, { medicine, reminder, medicineKitId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    medicineKitActions.addMedicineSuccess,
    (state, { medicine, reminder, medicineKitId }) => {
      const medicineWithReminder = {
        ...medicine,
        reminders: [reminder],
      };

      return {
        ...state,
        medicineKits: state.medicineKits.map((kit) =>
          kit.id !== medicineKitId
            ? kit
            : {
                ...kit,
                medicines: [...kit.medicines, medicineWithReminder],
              }
        ),
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),
  on(medicineKitActions.addMedicineError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Edit medicine in medicine kit
  on(
    medicineKitActions.updateMedicine,
    (state, { medicine, reminder, medicineKitId }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    medicineKitActions.updateMedicineSuccess,
    (state, { medicine, reminder, medicineKitId }) => {
      const medicineWithReminder = {
        ...medicine,
        reminders: [reminder],
      };

      return {
        ...state,
        medicineKits: state.medicineKits.map((kit) =>
          kit.id !== medicineKitId
            ? kit
            : {
                ...kit,
                medicines: kit.medicines.map((m) =>
                  m.id !== medicine.id ? m : medicineWithReminder
                ),
              }
        ),
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),
  on(medicineKitActions.updateMedicineError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  })),

  // Change medicine amount on medicineKit
  on(
    medicineKitActions.updateMedicineAmount,
    (state, { reminder, increase }) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),
  on(
    medicineKitActions.updateMedicineAmountSuccess,
    (state, { reminder, increase }) => {
      return {
        ...state,
        medicineKits: state.medicineKits
          ? state.medicineKits.map((medicineKit) => {
              if (medicineKit.id === reminder.medicineKitId) {
                return {
                  ...medicineKit,
                  medicines: medicineKit.medicines.map((medicine) => {
                    if (medicine.id === reminder.medicineId) {
                      return {
                        ...medicine,
                        amount: medicine.amount + (increase ? 1 : -1),
                      };
                    }
                    return medicine;
                  }),
                };
              }
              return medicineKit;
            })
          : state.medicineKits,
        reminders: state.reminders
          ? state.reminders.map((stateReminder) => {
              if (stateReminder.id === reminder.id) {
                return {
                  ...stateReminder,
                  medicineAmount: stateReminder.medicineAmount! + (increase ? 1 : -1),
                };
              }
              return stateReminder;
            })
          : state.reminders,
        organizedReminders: state.organizedReminders
          ? state.organizedReminders.map((pair) => {
              if (!pair) return null;

              const [date, reminderPairs] = pair;

              const updatedReminderPairs = reminderPairs.map(
                ([reminderItem, status]) => {
                  if (reminderItem.id === reminder.id) {
                    return [
                      {
                        ...reminderItem,
                        medicineAmount: reminderItem.medicineAmount! + (increase ? 1 : -1),
                      },
                      status,
                    ] as [ReminderDTO, boolean];
                  }
                  return [reminderItem, status] as [ReminderDTO, boolean];
                }
              );

              return [date, updatedReminderPairs] as [
                Date,
                [ReminderDTO, boolean][]
              ];
            })
          : state.organizedReminders,
        loading: false,
        loaded: true,
        error: null,
      };
    }
  ),
  on(medicineKitActions.updateMedicineError, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: true,
    error: error,
  }))
);
