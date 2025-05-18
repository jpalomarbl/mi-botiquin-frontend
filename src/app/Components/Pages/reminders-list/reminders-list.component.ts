// Angular
import { Component } from '@angular/core';

// Router
import { ActivatedRoute, Router } from '@angular/router';

// Ngrx, Rxjs and Redux
import { ofType } from '@ngrx/effects';
import { distinctUntilChanged, filter, Observable, take } from 'rxjs';

// Store
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import {
  fetchCaretakerRelationships,
  fetchCaretakerRelationshipsError,
  fetchFamilyMemberRelationships,
  fetchFamilyMemberRelationshipsError,
} from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';
import {
  selectUser,
  selectUserRelationships,
} from 'src/app/Store/auth/selectors/auth.selectors';
import {
  changeReminderState,
  changeReminderStateError,
  fetchAllUserReminders,
  fetchAllUserRemindersError,
} from 'src/app/Store/medicine/actions/reminder.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

// Angular Material
import { MatDialog } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Data types
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { UserDTO } from 'src/app/Models/user.dto';

// Pipes
import { DatePipe } from '@angular/common';
import { DateFormatPipe } from 'src/app/Pipes/date-format.pipe';
import { ShortenTextPipe } from 'src/app/Pipes/shorten-text.pipe';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    AngularMaterialModule,
    DateFormatPipe,
    ShortenTextPipe,
    DatePipe,
  ],
  providers: [DatePipe, ShortenTextPipe],
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss'],
})
export class RemindersListComponent {
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;
  organizedReminders$: Observable<
    Array<[Date, [ReminderDTO, boolean][]] | null>
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

  // These control whether the user sees "Ayer", "Hoy" or "Mañana" on the date picker section
  isYesterday: boolean;
  isTomorrow: boolean;
  isToday: boolean;

  // If user is a patient patient selector will not be displayed
  isPatient: boolean;

  // Reminders grouped by next doses
  organizedReminders: Array<[Date, ReminderDTO[]]>;

  // Debounce control
  lastClickTime: number;

  // datePicker: FormControl;
  // datePickerForm: FormGroup;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private actions$: Actions,
    public errorDialog: MatDialog
  ) {
    this.user$ = this.store.select(selectUser);
    this.userRelationships$ = this.store.select(selectUserRelationships);
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

    this.organizedReminders = [];

    this.lastClickTime = 0;

    this.isToday = false;
    this.isYesterday = false;
    this.isTomorrow = false;

    this.isPatient = false;

    // this.datePicker = new FormControl(this.today);
    // this.datePickerForm = new FormGroup({
    //   datePicker: this.datePicker,
    // });

    this.calculateDate();
  }

  ngOnInit() {
    this.route.params.pipe(distinctUntilChanged()).subscribe((params) => {
      this.userId = params['userId'] ? +params['userId'] : 0;

      this.calculateDate();
      this.loadData(this.userId);
    });

    // We fetch all user reminders and filter them for the specified day.
    if (
      !this.router.url.includes('forwards') &&
      !this.router.url.includes('backwards')
    ) {
      this.loadData(this.userId);
    }

    // this.store.dispatch(
    //   fetchAllUserConsumptions({ userId: 2, day: new Date() })
    // );

    this.actions$
      .pipe(
        ofType(
          changeReminderStateError,
          fetchAllUserRemindersError,
          fetchCaretakerRelationshipsError,
          fetchFamilyMemberRelationshipsError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.errorDialog);
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
        this.router.navigate(['remindersList' + userIdString]);
      } else if (isForwards) {
        this.router.navigate([
          'remindersList' + userIdString + '/forwards',
          this.daysDisplaced,
        ]);
      } else if (isBackwards) {
        this.router.navigate([
          'remindersList' + userIdString + '/backwards',
          this.daysDisplaced,
        ]);
      }
    } else
      this.router.navigate(['remindersList' + userIdString + '/backwards/1']);
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
        this.router.navigate(['remindersList' + userIdString]);
      } else if (isForwards) {
        this.router.navigate([
          'remindersList' + userIdString + '/forwards',
          this.daysDisplaced,
        ]);
      } else if (isBackwards) {
        this.router.navigate([
          'remindersList' + userIdString + '/backwards',
          this.daysDisplaced,
        ]);
      }
    } else
      this.router.navigate(['remindersList' + userIdString + '/forwards/1']);
  }

  changeReminderState(
    index: number,
    reminderId: number,
    time: Date,
    status: boolean
  ) {
    this.store.dispatch(
      changeReminderState({
        index: index,
        reminderId: reminderId,
        time: time,
        status: status,
      })
    );
  }

  loadData(userId: number = 0): void {
    this.userId = userId;

    // If a userId has been specified, we search for that user's reminders.
    // If not, we search for the logged in user's reminders.
    if (userId && +userId !== 0) {
      this.userId = +userId;

      this.store.dispatch(
        fetchAllUserReminders({
          userId: userId,
          day: this.day,
        })
      );
    } else {
      this.user$
        .pipe(filter((user) => user !== null))
        .subscribe((user: UserDTO | null) => {
          if (user) {
            this.store.dispatch(
              fetchAllUserReminders({
                userId: user.id,
                day: this.day,
              })
            );

            if (user.role === 'caretaker') {
              this.store.dispatch(
                fetchCaretakerRelationships({ userId: user.id })
              );
            } else if (user.role === 'family member') {
              this.store.dispatch(
                fetchFamilyMemberRelationships({ userId: user.id })
              );
            } else this.isPatient = true;
          }
        });
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
