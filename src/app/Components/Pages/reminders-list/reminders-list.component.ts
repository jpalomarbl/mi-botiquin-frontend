// Angular
import { Component } from '@angular/core';

// Router
import { ActivatedRoute, Router } from '@angular/router';

// Ngrx, Rxjs and Redux
import { ofType } from '@ngrx/effects';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  take,
} from 'rxjs';

// Store
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import * as userRelationshipsActions from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';
import * as reminderActions from 'src/app/Store/medicine/actions/reminder.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

// Angular Material
import { MatDialog } from '@angular/material/dialog';

// Data types
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { organizedRemindersObject } from 'src/app/Models/medicineState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss'],
})
export class RemindersListComponent {
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;
  organizedReminders$: Observable<
    Array<[Date, [ReminderDTO, organizedRemindersObject][]] | null>
  >;

  loadingMedicine$: Observable<boolean>;
  loadingAuth$: Observable<boolean>;

  errorMedicine$: Observable<any>;
  errorAuth$: Observable<any>;

  // Amount of days displaced from today
  daysDisplaced: number;

  today: Date;

  // Day = today +/- daysDisplaced
  day: Date;

  userId: number;
  userIdSelect: number;

  // These control whether the user sees "Ayer", "Hoy" or "Mañana" on the date picker section
  isYesterday: boolean;
  isTomorrow: boolean;
  isToday: boolean;

  // If user is a patient patient selector will not be displayed
  isPatient: boolean;

  // True if reminders is empty
  isRemindersEmpty: boolean;

  // Reminders grouped by next doses
  organizedReminders: Array<[Date, ReminderDTO[]]>;

  // Debounce control
  lastClickTime: number;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private actions$: Actions,
    public dialog: MatDialog
  ) {
    this.user$ = this.store.select(authSelectors.selectUser);
    this.userRelationships$ = this.store.select(
      authSelectors.selectUserRelationships
    );
    this.organizedReminders$ = this.store.select(
      medicineSelectors.selectOrganizedReminders
    );

    this.loadingMedicine$ = this.store.select(
      medicineSelectors.selectMedicineLoading
    );
    this.loadingAuth$ = this.store.select(authSelectors.selectAuthLoading);

    this.errorMedicine$ = this.store.select(
      medicineSelectors.selectMedicineError
    );
    this.errorAuth$ = this.store.select(authSelectors.selectAuthError);

    // It's important that we set today's date at midnight because
    // we want to list every reminder form the day, not just from now.
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.day = new Date(this.today);

    this.daysDisplaced = 0;

    this.userId = 0;
    this.userIdSelect = 0;

    this.organizedReminders = [];

    this.lastClickTime = 0;

    this.isToday = false;
    this.isYesterday = false;
    this.isTomorrow = false;
    this.isRemindersEmpty = false;

    this.isPatient = false;

    this.calculateDate();
  }

  ngOnInit() {
    // Whatever happens first (route change or user data update) will trigger data load
    combineLatest([this.route.params.pipe(distinctUntilChanged()), this.user$])
      .pipe(
        filter(([params, user]) => user !== null),
        map(([params, user]) => {
          return user;
        })
      )
      .subscribe((user) => {
        this.userId = user!.id;

        this.calculateDate();

        this.loadData(this.userId, user!.role);

        // this.route.params
        //   .pipe(distinctUntilChanged())
        //   .subscribe((params) => {});

        // // We fetch all user reminders and filter them for the specified day.
        // if (
        //   !this.router.url.includes('forwards') &&
        //   !this.router.url.includes('backwards')
        // ) {
        //   this.loadData(user!.id, user!.role);
        // }
      });

    this.actions$
      .pipe(ofType(reminderActions.fetchAllUserRemindersSuccess))
      .subscribe((reminders) => {
        if (reminders.reminders.length === 0) {
          this.isRemindersEmpty = true;
        } else {
          this.isRemindersEmpty = false;
        }
      });

    this.actions$
      .pipe(
        ofType(
          reminderActions.changeReminderStateError,
          reminderActions.fetchAllUserRemindersError,
          userRelationshipsActions.fetchCaretakerRelationshipsError,
          userRelationshipsActions.fetchFamilyMemberRelationshipsError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });
  }

  navigateToPreviousDay() {
    const now = Date.now();
    if (now - this.lastClickTime < 500) return;
    this.lastClickTime = now;

    const isBackwards = this.router.url.includes('backwards');
    const isForwards = this.router.url.includes('forwards');

    const userIdString =
      this.userId && this.userId !== 0 ? `/${this.userId.toString()}` : '';

    if (this.daysDisplaced > 0) {
      this.daysDisplaced += isBackwards ? +1 : isForwards ? -1 : 0;

      if (this.daysDisplaced === 0) {
        this.router.navigate(['remindersList']);
      } else if (isForwards) {
        this.router.navigate([
          'remindersList' + '/forwards',
          this.daysDisplaced,
        ]);
      } else if (isBackwards) {
        this.router.navigate([
          'remindersList' + '/backwards',
          this.daysDisplaced,
        ]);
      }
    } else this.router.navigate(['remindersList' + '/backwards/1']);
  }

  navigateToNextDay() {
    const now = Date.now();
    if (now - this.lastClickTime < 500) return; // Evita múltiples clics en 500ms
    this.lastClickTime = now;

    const isBackwards = this.router.url.includes('backwards');
    const isForwards = this.router.url.includes('forwards');

    const userIdString =
      this.userId && this.userId !== 0 ? `/${this.userId.toString()}` : '';

    if (this.daysDisplaced > 0) {
      this.daysDisplaced += isBackwards ? -1 : isForwards ? +1 : 0;

      if (this.daysDisplaced === 0) {
        this.router.navigate(['remindersList']);
      } else if (isForwards) {
        this.router.navigate([
          'remindersList' + '/forwards',
          this.daysDisplaced,
        ]);
      } else if (isBackwards) {
        this.router.navigate([
          'remindersList' + '/backwards',
          this.daysDisplaced,
        ]);
      }
    } else this.router.navigate(['remindersList' + '/forwards/1']);
  }

  changeReminderState(
    reminder: [ReminderDTO, organizedRemindersObject],
    time: Date,
    status: boolean,
    increase: boolean
  ) {
    if (reminder[1].consumed && !reminder[1].subtracted) {
      this.store.dispatch(
        reminderActions.changeReminderState({
          reminder: reminder[0],
          time: time,
          status: status,
          increase: increase,
          halfConsumption: true,
        })
      );

      return;
    } else if (reminder[1].consumed && reminder[1].subtracted) {
      this.store.dispatch(
        reminderActions.changeReminderState({
          reminder: reminder[0],
          time: time,
          status: status,
          increase: increase,
        })
      );

      return;
    }

    this.dialogService.openMedicineConsumptionDialog(
      {
        reminder: reminder[0],
        time: time,
        status: status,
        increase: increase,
        consumed: reminder[1].consumed,
      },
      this.dialog
    );
  }

  loadData(userId: number = 0, role?: string): void {
    console.log("loadData UserId", userId)
    console.log("app UserId", this.userId)

    // If we're looking for any user other than the logged in user's reminders
    // we just fetch that user's reminders.
    // Otherwise, we fetch the logged in user's reminders, and their relationships.
    if (this.userId !== userId) {
      // this.userId = +userId;

      this.store.dispatch(
        reminderActions.fetchAllUserReminders({
          userId: userId,
          day: this.day,
        })
      );
    } else {
      this.store.dispatch(
        reminderActions.fetchAllUserReminders({
          userId: userId,
          day: this.day,
        })
      );

      if (role === 'caretaker') {
        this.store.dispatch(
          userRelationshipsActions.fetchCaretakerRelationships({
            userId: userId,
          })
        );
      } else if (role === 'family member') {
        this.store.dispatch(
          userRelationshipsActions.fetchFamilyMemberRelationships({
            userId: userId,
          })
        );
      } else this.isPatient = true;
    }
  }

  private calculateDate(): void {
    // It's important that we set today's date at midnight because
    // we want to list every reminder form the day, not just from now.
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.day = new Date(this.today);

    this.daysDisplaced = this.route.snapshot.params['daysDisplaced']
      ? +this.route.snapshot.params['daysDisplaced']
      : 0;

    // If the user has navigated already to a different date, the route will be
    // 'remindersList/forwards' or 'remindersList/backwards'. We set this.day
    // according to that.
    if (this.daysDisplaced > 0) {
      if (this.router.url.includes('forwards')) {
        this.day.setDate(this.day.getDate() + this.daysDisplaced);
      } else if (this.router.url.includes('backwards')) {
        this.day.setDate(this.day.getDate() - this.daysDisplaced);
      }
    }

    this.isYesterday =
      this.router.url.includes('backwards') && this.daysDisplaced === 1;
    this.isTomorrow =
      this.router.url.includes('forwards') && this.daysDisplaced === 1;
    this.isToday = this.daysDisplaced === 0;
  }
}
