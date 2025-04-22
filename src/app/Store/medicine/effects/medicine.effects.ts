import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ReminderDTO } from 'src/app/Models/reminder.dto';
import * as MedicineActions from '../actions/medicine.actions';
import { ReminderService } from '../services/medicine.service';

@Injectable()
export class MedicineEffects {
  constructor(
    private actions$: Actions,
    private reminderService: ReminderService,
    private router: Router,
    private store: Store
  ) {}

  fetchUserRemindersForToday$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicineActions.fetchUserRemindersForToday),
      mergeMap(({ userId }) =>
        this.reminderService.fetchUserRemindersForToday(userId).pipe(
          map((response: any) => {
            const reminders = response.map((row: ReminderDTO) => ({
              id: row.id,
              frequency: row.frequency,
              frequencyUnit: row.frequencyUnit,
              start: new Date(row.start),
              finish: new Date(row.finish),
              amount: row.amount,
              medicineId: row.medicineId,
              medicineUnit: row.medicineUnit,
              medicineName: row.medicineName,
              medicinKitName: row.medicineKitName,
            }));

            return MedicineActions.fetchUserRemindersForTodaySuccess({
              reminders: reminders,
            });
          }),
          catchError((error) =>
            of(
              MedicineActions.fetchUserRemindersForTodayError({
                error:
                  error.error.error || 'Get user reminders for today failed',
              })
            )
          )
        )
      )
    )
  );

  fetchUserRemindersForTodaySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MedicineActions.fetchUserRemindersForTodaySuccess),
        tap(({ reminders }) => console.log(reminders))
      ),
    { dispatch: false }
  );

  fetchUserMedicineKits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicineActions.fetchUserMedicineKits),
      mergeMap(({ userId }) =>
        this.reminderService.fetchUserRemindersForToday(userId).pipe(
          map((response: any) => {
            const reminders = response.map((row: ReminderDTO) => ({
              id: row.id,
              frequency: row.frequency,
              frequencyUnit: row.frequencyUnit,
              start: new Date(row.start),
              finish: new Date(row.finish),
              amount: row.amount,
              medicineId: row.medicineId,
              medicineUnit: row.medicineUnit,
              medicineName: row.medicineName,
              medicinKitName: row.medicineKitName,
            }));

            return MedicineActions.fetchUserRemindersForTodaySuccess({
              reminders: reminders,
            });
          }),
          catchError((error) =>
            of(
              MedicineActions.fetchUserRemindersForTodayError({
                error:
                  error.error.error || 'Get user reminders for today failed',
              })
            )
          )
        )
      )
    )
  );
}
