import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import * as MedicineActions from '../actions/medicine.actions';
import { MedicineKitService } from '../services/medicineKit.service';

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
      ofType(MedicineActions.fetchUserMedicineKits),
      mergeMap(({ userId, role }) =>
        this.medicineKitService.fetchUserMedicineKits(userId, role).pipe(
          map((response: any) => {
            const medicineKits = response.map((row: MedicineKitDTO) => ({
              id: row.id,
              owner: row.owner,
              name: row.name,
              note: row.note,
              medicines: row.medicines
            }));

            return MedicineActions.fetchUserMedicineKitsSuccess({
              medicineKits: medicineKits,
            });
          }),
          catchError((error) =>
            of(
              MedicineActions.fetchUserMedicineKitsError({
                error:
                  error.error.error || 'Fetch user medicine kits failed',
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
        ofType(MedicineActions.fetchUserMedicineKitsSuccess),
        tap(({ medicineKits }) => console.log(medicineKits))
      ),
    { dispatch: false }
  );
}
