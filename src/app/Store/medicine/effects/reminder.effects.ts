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
  ) {}

  fetchUserRemindersForToday$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reminderActions.fetchUserRemindersForToday),
      mergeMap(({ userId }) =>
        this.reminderService.fetchUserRemindersForToday(userId).pipe(
          map((response: any) => {
            const reminders = response
              .slice(0, 3)
              .filter((row: ReminderDTO) => {
                const dayAfter = new Date();
                dayAfter.setDate(dayAfter.getDate() + 1);
                dayAfter.setHours(0, 0, 0, 0);
                const finishDate = new Date(row.finish);
                const nextDose = this.reminderService.getNextDoseTime(
                  row,
                  new Date()
                );

                return (
                  nextDose.getTime() < dayAfter.getTime() &&
                  nextDose.getTime() < finishDate.getTime()
                );
              })
              .map((row: ReminderDTO) => ({
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
      mergeMap(({ userId, day }) =>
        this.reminderService.fetchAllUserReminders(userId).pipe(
          map((response: any) => {
            const reminders = response
              .filter((row: ReminderDTO) => {
                const dayAfter = new Date(day);
                dayAfter.setDate(dayAfter.getDate() + 1);
                const finishDate = new Date(row.finish);
                const nextDose = this.reminderService.getNextDoseTime(
                  row,
                  new Date()
                );

                return (
                  nextDose.getTime() < dayAfter.getTime() &&
                  nextDose.getTime() < finishDate.getTime()
                );
              })
              .map((row: ReminderDTO) => ({
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

            return reminderActions.fetchAllUserRemindersSuccess({
              reminders: reminders[0]
              ? reminders.filter((reminder: ReminderDTO) => reminder !== null)
              : null,
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
