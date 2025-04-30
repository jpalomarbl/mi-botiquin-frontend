import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import * as reminderKitActions from 'src/app/Store/medicine/actions/reminders.actions';
import { MedicineKitService } from '../../../Services/medicineKit.service';

@Injectable()
export class MedicineKitEffects {
  constructor(
    private actions$: Actions,
    private medicineKitService: MedicineKitService,
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
      mergeMap(({ medicineId, medicineKitId }) =>
        this.medicineKitService.deleteMedicineById(medicineId).pipe(
          map((response: any) => {
            return medicineKitActions.fetchMedicineKitById({
              medicineKitId: medicineKitId,
            });
          }),
          catchError((error) =>
            of(
              medicineKitActions.deleteMedicineByIdError({
                error: error.error.error || 'Fetch user medicine kits failed',
              })
            )
          )
        )
      )
    )
  );

  addMedicineKit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.addMedicineKit),
      mergeMap(({ medicineKit }) =>
        this.medicineKitService.addMedicineKit(medicineKit).pipe(
          map((response: any) => {
            console.log(response);

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
                  formaFarmaceuticaSimplificada: medicine.formaFarmaceuticaSimplificada.nombre,
                  viaAdmininstracion: medicine.viasAdministracion[0].nombre
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
            console.log(response);

            if(reminder)
              return reminderKitActions.addReminder({ reminder: reminder, medicineId: response.id! })
            else
              return medicineKitActions.addMedicineSuccess();

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
}
