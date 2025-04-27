import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';

import { ConsumptionDTO } from 'src/app/Models/consumption.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';
import { ReminderService } from '../../../Services/reminder.service';

@Injectable()
export class ReminderEffects {
  constructor(
    private actions$: Actions,
    private reminderService: ReminderService
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
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dayAfter = new Date();
                dayAfter.setDate(dayAfter.getDate() + 1);
                dayAfter.setHours(0, 0, 0, 0);
                const finishDate = new Date(row.finish);
                const nextDose = this.reminderService.getNextDoseTime(
                  row,
                  today
                );

                console.log(nextDose.getTime() < dayAfter.getTime() &&
                nextDose.getTime() < finishDate.getTime())

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
                medicineKitName: row.medicineKitName,
                ownerId: row.ownerId,
                ownerFirstName: row.ownerFirstName,
                ownerLastName: row.ownerLastName
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

  fetchAllUserReminders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reminderActions.fetchAllUserReminders),
      debounceTime(300),
      mergeMap(({ userId, day }) =>
        this.reminderService.fetchAllUserReminders(userId).pipe(
          map((response: any) => {
            const reminders = response
              .filter((row: ReminderDTO) => {
                const dayAfter = new Date(day);
                dayAfter.setDate(dayAfter.getDate() + 1);
                const finishDate = new Date(row.finish);
                const nextDose = this.reminderService.getNextDoseTime(row, day);

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
                medicineKitName: row.medicineKitName,
              }));

            // const organizedReminders: Array<[Date, ReminderDTO[]] | null> =
            //   this.reminderService.organizeReminders(reminders, day);

            // return reminderActions.fetchAllUserRemindersSuccess({
            //   organizedReminders: organizedReminders,
            //   reminders: reminders
            // });

            return reminderActions.fetchAllUserConsumptions({
              userId: userId,
              reminders: reminders,
              day: day,
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

  fetchAllUserConsumptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reminderActions.fetchAllUserConsumptions),
      debounceTime(300),
      mergeMap(({ userId, reminders, day }) =>
        this.reminderService.fetchAllUserConsumptions(userId).pipe(
          map((response: ConsumptionDTO[]) => {
            const consumptions: ConsumptionDTO[] = response.map(
              (consumption) => ({
                reminderId: consumption.reminderId,
                consumptionDate: new Date(consumption.consumptionDate),
              })
            );

            const organizedReminders: Array<
              [Date, [ReminderDTO, boolean][]] | null
            > = this.reminderService.organizeReminders(
              reminders,
              consumptions,
              day
            );

            return reminderActions.fetchAllUserRemindersSuccess({
              reminders: reminders,
              organizedReminders: organizedReminders,
            });
          }),
          catchError((error) =>
            of(
              reminderActions.fetchAllUserRemindersError({
                error: error.error || 'Get all user consumptions failed',
              })
            )
          )
        )
      )
    )
  );

  changeReminderState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reminderActions.changeReminderState),
      debounceTime(300),
      mergeMap(({ reminderId, time, status }) =>
        this.reminderService.changeReminderState(reminderId, time, status).pipe(
          catchError((error) =>
            of(
              reminderActions.fetchAllUserRemindersError({
                error: error.error || 'Get all user consumptions failed',
              })
            )
          )
        )
      )
    ),
    { dispatch: false }
  );

  // stopConsumingReminder$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(reminderActions.stopConsumingReminder),
  //     debounceTime(300),
  //     mergeMap(({ reminderId, time }) =>
  //       this.reminderService.stopConsumingReminder(reminderId, time).pipe(
  //         map((response: ConsumptionDTO[]) => {

  //           console.log(response)

  //         }),
  //         catchError((error) =>
  //           of(
  //             reminderActions.fetchAllUserRemindersError({
  //               error: error.error || 'Get all user consumptions failed',
  //             })
  //           )
  //         )
  //       )
  //     )
  //   ),
  //   { dispatch: false }
  // );
}
