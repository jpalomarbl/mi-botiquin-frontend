import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import * as reminderKitActions from 'src/app/Store/medicine/actions/reminder.actions';
import { MedicineKitService } from '../../../Services/medicineKit.service';

@Injectable()
export class MedicineKitEffects {
  constructor(
    private actions$: Actions,
    private medicineKitService: MedicineKitService
  ) {}

  fetchUserMedicineKits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.fetchUserMedicineKits),
      mergeMap(({ userId, role }) =>
        this.medicineKitService.fetchUserMedicineKits(userId, role).pipe(
          map((response: any) => {
            const medicineKits = response.map((row: MedicineKitDTO) => ({
              id: row.id,
              owner: row.owner,
              name: row.name,
              note: row.note,
              medicines: row.medicines,
            }));

            return medicineKitActions.fetchUserMedicineKitsSuccess({
              medicineKits: medicineKits[0]
                ? medicineKits.filter(
                    (medicineKit: MedicineKitDTO) => medicineKit !== null
                  )
                : null,
            });
          }),
          catchError((error) =>
            of(
              medicineKitActions.fetchUserMedicineKitsError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );

  fetchUserMedicineKitsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.fetchUserMedicineKits),
      take(1)
    )
  );

  fetchMedicineKitById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.fetchMedicineKitById),
      mergeMap(({ medicineKitId }) =>
        this.medicineKitService.fetchMedicineKitById(medicineKitId).pipe(
          map((response: MedicineKitDTO) => {
            return medicineKitActions.fetchMedicineKitByIdSuccess({
              medicineKit: {
                ...response,
                medicines: response.medicines.map((medicine) => ({
                  ...medicine,
                  expirationDate: new Date(medicine.expirationDate),
                })),
              },
            });
          }),
          catchError((error) =>
            of(
              medicineKitActions.fetchMedicineKitByIdError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );

  deleteMedicineById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.deleteMedicineById),
      mergeMap(({ medicineId, medicineKitId }) => {
        return this.medicineKitService.deleteMedicineById(medicineId).pipe(
          map((response: any) => {
            return medicineKitActions.deleteMedicineByIdSuccess({
              medicineId: medicineId,
              medicineKitId: medicineKitId,
            });
          }),
          catchError((error) => {
            return of(
              medicineKitActions.deleteMedicineByIdError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            );
          })
        );
      })
    )
  );

  addMedicineKit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.addMedicineKit),
      mergeMap(({ medicineKit }) =>
        this.medicineKitService.addMedicineKit(medicineKit).pipe(
          map((response: any) => {
            return medicineKitActions.addMedicineKitSuccess();
          }),
          catchError((error) =>
            of(
              medicineKitActions.addMedicineKitError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );

  fetchMedicinesCIMA$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.fetchMedicinesCIMA),
      mergeMap(({ medicineName }) =>
        this.medicineKitService.fetchMedicinesCIMA(medicineName).pipe(
          map((response) => {
            const medicines: MedicineDTO[] = response.resultados.map(
              (medicine: any) => {
                return {
                  id: 0,
                  name: medicine.nombre,
                  reminder: null,
                  unit: '',
                  amount: 0,
                  dose: medicine.dosis,
                  expirationDate: new Date(),
                  nregistro: medicine.nregistro,
                  formaFarmaceuticaSimplificada:
                    medicine.formaFarmaceuticaSimplificada.nombre,
                  viaAdmininstracion: medicine.viasAdministracion[0].nombre,
                };
              }
            );

            return medicineKitActions.fetchMedicinesCIMASuccess({
              medicines: medicines,
            });
          }),
          catchError((error) =>
            of(
              medicineKitActions.fetchMedicinesCIMAError({
                error: error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );

  addMedicine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.addMedicine),
      mergeMap(({ medicine, reminder, medicineKitId }) =>
        this.medicineKitService.addMedicine(medicine, medicineKitId).pipe(
          map((response: MedicineDTO) => {
            if (reminder)
              return reminderKitActions.addReminder({
                reminder: reminder,
                medicineId: response.id!,
                medicineKitId: medicineKitId,
              });
            else
              return medicineKitActions.addMedicineSuccess({
                medicine: medicine,
                reminder: reminder,
                medicineKitId: medicineKitId,
              });
          }),
          catchError((error) =>
            of(
              medicineKitActions.addMedicineError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );

  updateMedicine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.updateMedicine),
      mergeMap(({ medicine, reminder, medicineKitId, createReminder }) =>
        this.medicineKitService.updateMedicine(medicine).pipe(
          map((response: MedicineDTO) => {
            if (reminder && createReminder)
              return reminderKitActions.addReminder({
                reminder: reminder,
                medicineId: response.id!,
                medicineKitId: medicineKitId,
              });
            else if (reminder && !createReminder) {
              return reminderKitActions.updateReminder({
                reminder: reminder,
                medicineId: response.id!,
                medicineKitId: medicineKitId
              });
            } else
              return medicineKitActions.updateMedicineSuccess({
                medicine: medicine,
                reminder: reminder,
                medicineKitId: medicineKitId,
              });
          }),
          catchError((error) =>
            of(
              medicineKitActions.updateMedicineError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );
}
