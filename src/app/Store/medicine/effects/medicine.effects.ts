import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ReminderDTO } from 'src/app/Models/reminder.dto';
import * as MedicineActions from '../actions/medicine.actions';
import { ReminderService } from '../services/reminder.service';

@Injectable()
export class MedicineEffects {
  constructor(
    private actions$: Actions,
    private reminderService: ReminderService,
    private router: Router,
    private store: Store
  ) {}

  getUserRemindersForToday$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MedicineActions.getUserRemindersForToday),
      mergeMap(({ userId }) =>
        this.reminderService.getUserRemindersForToday(userId).pipe(
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

            return MedicineActions.getUserRemindersForTodaySuccess({
              reminders: reminders,
            });
          }),
          catchError((error) =>
            of(
              MedicineActions.getUserRemindersForTodayError({
                error: error.error.error || 'Get user reminders for today failed',
              })
            )
          )
        )
      )
    )
  );

  getUserRemindersForTodaySuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(MedicineActions.getUserRemindersForTodaySuccess),
          tap(({ reminders }) => console.log(reminders))
        ),
      { dispatch: false }
    )
}
