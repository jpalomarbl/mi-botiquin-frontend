// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Rxjs
import { ofType } from '@ngrx/effects';
import { Observable, take } from 'rxjs';

// Angular material
import { MatDialog } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

// Store
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import * as userRelationshipActions from 'src/app/Store/auth/actions/userRelationships.actions';
import {
  selectAuthLoading,
  selectUser,
  selectUserRelationships,
} from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

// Data models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-medicine-kits-list',
  templateUrl: './medicine-kits-list.component.html',
  styleUrls: ['./medicine-kits-list.component.scss'],
})
export class MedicineKitsListComponent {
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;
  medicineKits$: Observable<MedicineKitDTO[]>;

  loadingMedicine$: Observable<boolean>;
  loadingAuth$: Observable<boolean>;

  userId: number;

  isPatient: boolean;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private dialogService: DialogService,
    private actions$: Actions,
    public errorDialog: MatDialog
  ) {
    this.user$ = this.store.select(selectUser);
    this.userRelationships$ = this.store.select(selectUserRelationships);

    this.medicineKits$ = this.store.select(
      medicineSelectors.selectMedicineKits
    );

    this.loadingMedicine$ = this.store.select(
      medicineSelectors.selectMedicineLoading
    );
    this.loadingAuth$ = this.store.select(selectAuthLoading);

    this.userId = 0;

    this.isPatient = false;
  }

  ngOnInit(): void {
    this.loadData(this.userId);

    this.actions$
      .pipe(
        ofType(
          medicineKitActions.fetchUserMedicineKitsError,
          userRelationshipActions.fetchCaretakerRelationshipsError,
          userRelationshipActions.fetchFamilyMemberRelationshipsError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.errorDialog);
      });
  }

  loadData(userId: number, role: string = 'patient'): void {
    this.userId = userId;

    if (userId > 0) {
      this.store.dispatch(
        medicineKitActions.fetchUserMedicineKits({
          userId: userId,
          role: role,
        })
      );
    } else {
      this.user$.subscribe((user: UserDTO | null) => {
        if (user) {
          this.store.dispatch(
            medicineKitActions.fetchUserMedicineKits({
              userId: user.id,
              role: user.role,
            })
          );

          if (user.role === 'caretaker') {
            this.store.dispatch(
              userRelationshipActions.fetchCaretakerRelationships({
                userId: user.id,
              })
            );
          } else if (user.role === 'family member') {
            this.store.dispatch(
              userRelationshipActions.fetchFamilyMemberRelationships({
                userId: user.id,
              })
            );
          } else this.isPatient = true;
        }
      });
    }
  }

  navigateMedicineKitDetails(medicineKitId: number): void {
    this.router.navigate(['medicineKitDetails/' + medicineKitId.toString()]);
  }

  navigateAddMedicineKit(): void {
    this.router.navigate(['addMedicineKit']);
  }
}
