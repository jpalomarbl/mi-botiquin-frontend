// Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter, Observable, take } from 'rxjs';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { UserDTO } from 'src/app/Models/user.dto';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import * as userRelationShipActions from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import * as reminderActions from 'src/app/Store/medicine/actions/reminder.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

// Custom modules
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  todaysReminders$: Observable<ReminderDTO[]>;
  medicineKits$: Observable<MedicineKitDTO[]>;

  reminders: ReminderDTO[];
  medicineKits: MedicineKitDTO[];

  user: UserDTO | null;
  isPatient: boolean;
  oneReminder: boolean;
  oneMedicineKit: boolean;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private actions$: Actions,
    public errorDialog: MatDialog,
    private dialogService: DialogService
  ) {
    this.user$ = this.store.select(authSelectors.selectUser);
    this.userRelationships$ = this.store.select(
      authSelectors.selectUserRelationships
    );

    this.loading$ = this.store.select(medicineSelectors.selectMedicineLoading);
    this.error$ = this.store.select(medicineSelectors.selectMedicineError);

    this.todaysReminders$ = this.store.select(
      medicineSelectors.selectReminders
    );
    this.medicineKits$ = this.store.select(
      medicineSelectors.selectMedicineKits
    );

    this.reminders = [];
    this.medicineKits = [];

    this.user = null;

    this.isPatient = false;
    this.oneReminder = false;
    this.oneMedicineKit = false;
  }

  ngOnInit() {
    this.user$
      .pipe(filter((user) => user !== null))
      .subscribe((user: UserDTO | null) => {
        if (user) {
          const today = new Date();
          today.setHours(0, 0, 0);

          this.store.dispatch(
            reminderActions.fetchAllUserReminders({
              userId: user.id,
              day: today,
            })
          );

          this.store.dispatch(
            medicineKitActions.fetchUserMedicineKits({
              userId: user.id,
              role: user.role,
            })
          );

          if (user.role === 'caretaker') {
            this.store.dispatch(
              userRelationShipActions.fetchCaretakerRelationships({
                userId: user.id,
              })
            );
          } else if (user.role === 'family member') {
            this.store.dispatch(
              userRelationShipActions.fetchFamilyMemberRelationships({
                userId: user.id,
              })
            );
          } else this.isPatient = true;

          this.user = user! as UserDTO;
        }
      });

    this.userRelationships$.subscribe((relationships) => {
      if (relationships && relationships.length > 0) {
        relationships.forEach((user) => {
          this.store.dispatch(
            reminderActions.fetchUserRemindersForToday({ userId: user.id })
          );
        });
      }
    });

    this.actions$
      .pipe(ofType(reminderActions.fetchAllUserRemindersSuccess), take(1))
      .subscribe(() => {
        // Código a ejecutar después de eliminar
        this.todaysReminders$.subscribe((reminders) => {
          this.reminders = reminders;

          if (this.reminders && this.reminders.length > 0) {
            this.oneReminder = true;
          }
        });
      });

    this.actions$
      .pipe(ofType(medicineKitActions.fetchUserMedicineKitsSuccess), take(1))
      .subscribe(() => {
        // Código a ejecutar después de eliminar
        this.medicineKits$.subscribe((medicineKits) => {
          this.medicineKits = medicineKits;

          if (this.medicineKits && this.medicineKits.length > 0) {
            this.oneMedicineKit = true;
          }
        });
      });

    this.actions$
      .pipe(ofType(medicineKitActions.fetchUserMedicineKitsSuccess), take(1))
      .subscribe(() => {
        this.medicineKits$.subscribe((medicineKits) => {
          this.medicineKits = medicineKits;
        });
      });

    this.actions$
      .pipe(
        ofType(
          reminderActions.fetchAllUserRemindersError,
          medicineKitActions.fetchUserMedicineKitsError,
          userRelationShipActions.fetchCaretakerRelationshipsError,
          userRelationShipActions.fetchFamilyMemberRelationshipsError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.errorDialog);
      });

    console.log(this.oneMedicineKit, this.oneReminder);
  }

  navigateRemindersList(): void {
    this.router.navigate(['/remindersList']);
  }

  navigateMedicineKitsList(): void {
    this.router.navigate(['medicineKitsList']);
  }

  navigateMedicineKitDetails(medicineKitId: number): void {
    this.router.navigate(['medicineKitDetails/' + medicineKitId.toString()]);
  }

  navigateRelationships(): void {
    this.router.navigate(['relationships']);
  }
}
