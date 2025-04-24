import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ReminderDTO } from 'src/app/Models/reminder.dto';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';
import { ReminderService } from '../../../Services/reminder.service';

@Injectable()
export class ReminderEffects {
  constructor(
    private actions$: Actions,
    private reminderService: ReminderService,
    private router: Router,
    private store: Store
  ) {}

  fetchUserRemindersForToday$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reminderActions.fetchUserRemindersForToday),
      mergeMap(({ userId }) =>
        this.reminderService.fetchUserRemindersForToday(userId).pipe(
          map((response: any) => {
            const reminders = response.map(
              (row: ReminderDTO, index: number) => {
                if (index > 2) return null; // Limit to 3 reminders

                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const startDate = new Date(row.start);
                const finishDate = new Date(row.finish);
                const frequency = row.frequency;
                const frequencyUnit = row.frequencyUnit;
                const lastDose = this.reminderService.getLastDoseTime(
                  today,
                  startDate,
                  frequency,
                  frequencyUnit
                );
                const nextDose = new Date(lastDose.getTime());

                switch (frequencyUnit) {
                  case 'minutes':
                    nextDose.setMinutes(nextDose.getMinutes() + frequency);
                    break;

                  case 'hours':
                    nextDose.setHours(nextDose.getHours() + frequency);
                    break;

                  case 'days':
                    nextDose.setDate(nextDose.getDate() + frequency);
                    break;
                }

                if (
                  nextDose.getTime() < tomorrow.getTime() &&
                  nextDose.getTime() < finishDate.getTime()
                ) {
                  return {
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
                  };
                } else return null;
              }
            );

            return reminderActions.fetchUserRemindersForTodaySuccess({
              reminders: reminders[0]
                ? reminders.filter((reminder: ReminderDTO) => reminder !== null)
                : null,
            });
          }),
          catchError((error) =>
            of(
              reminderActions.fetchUserRemindersForTodayError({
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
        ofType(reminderActions.fetchUserRemindersForTodaySuccess)
        // tap(({ reminders }) => console.log(reminders))
      ),
    { dispatch: false }
  );

  fetchAllUserReminders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reminderActions.fetchAllUserReminders),
      mergeMap(({ userId }) =>
        this.reminderService.fetchAllUserReminders(userId).pipe(
          map((response: any) => {
            return reminderActions.fetchAllUserRemindersSuccess({
              reminders: response.map((row: ReminderDTO) => ({
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
              })),
            });
          }),
          catchError((error) =>
            of(
              reminderActions.fetchAllUserRemindersError({
                error: error.error.error || 'Get all user reminders failed',
              })
            )
          )
        )
      )
    )
  );

  fetchAllUserRemindersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(reminderActions.fetchAllUserRemindersSuccess),
        tap(({ reminders }) => console.log(reminders))
      ),
    { dispatch: false }
  );
}
