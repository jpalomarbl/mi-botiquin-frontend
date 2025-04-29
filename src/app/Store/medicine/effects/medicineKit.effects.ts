import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { MedicineKitService } from '../../../Services/medicineKit.service';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';

@Injectable()
export class MedicineKitEffects {
  constructor(
    private actions$: Actions,
    private medicineKitService: MedicineKitService,
    private router: Router,
    private store: Store
  ) {}

  fetchUserMedicineKits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.fetchUserMedicineKits),
      mergeMap(({ userId, role }) =>
        this.medicineKitService.fetchUserMedicineKits(userId, role).pipe(
          map((response: any) => {
            const medicineKits = response.map(
              (row: MedicineKitDTO, index: number) => {
                if (index > 2) return null; // Limit to 3 medicine kits
                else {
                  return {
                    id: row.id,
                    owner: row.owner,
                    name: row.name,
                    note: row.note,
                    medicines: row.medicines,
                  };
                }
              }
            );

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

  fetchUserMedicineKitsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(medicineKitActions.fetchUserMedicineKitsSuccess),
        tap(({ medicineKits }) => console.log(medicineKits))
      ),
    { dispatch: false }
  );

  fetchMedicineKitById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(medicineKitActions.fetchMedicineKitById),
      mergeMap(({ medicineKitId }) =>
        this.medicineKitService.fetchMedicineKitById(medicineKitId).pipe(
          map((response: MedicineKitDTO) => {
            return medicineKitActions.fetchMedicineKitByIdSuccess({
              medicineKit: response
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
              medicineKitId: medicineKitId
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
}
