// Angular
import { Component } from '@angular/core';

// Router
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Ngrx and Observables
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, Observable } from 'rxjs';
import {
  fetchCaretakerRelationships,
  fetchFamilyMemberRelationships,
} from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';
import {
  selectUser,
  selectUserRelationships,
} from 'src/app/Store/auth/selectors/auth.selectors';
import { fetchAllUserReminders } from 'src/app/Store/medicine/actions/reminders.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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

// Custom services
import { ReminderService } from 'src/app/Services/reminder.service';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
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
    private reminderService: ReminderService
  ) {
    this.user$ = this.store.select(selectUser);
    this.userRelationships$ = this.store.select(selectUserRelationships);

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
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(() => {
        this.calculateDate();
        this.loadData();
      });

    // We fetch all user reminders and filter them for the specified day.
    this.loadData();
  }

  navigateToPreviousDay() {
    const now = Date.now();
    if (now - this.lastClickTime < 500) return;
    this.lastClickTime = now;

    const isBackwards = this.router.url.includes('backwards');
    const isForwards = this.router.url.includes('forwards');

    if (this.daysDisplaced > 0) {
      this.daysDisplaced += isBackwards ? +1 : isForwards ? -1 : 0;

      if (this.daysDisplaced === 0) {
        this.router.navigate(['remindersList']);
      } else if (isForwards) {
        this.router.navigate(['remindersList/forwards', this.daysDisplaced]);
      } else if (isBackwards) {
        this.router.navigate(['remindersList/backwards', this.daysDisplaced]);
      }
    } else this.router.navigate(['remindersList/backwards/1']);
  }

  navigateToNextDay() {
    const now = Date.now();
    if (now - this.lastClickTime < 500) return; // Evita múltiples clics en 500ms
    this.lastClickTime = now;

    const isBackwards = this.router.url.includes('backwards');
    const isForwards = this.router.url.includes('forwards');

    if (this.daysDisplaced > 0) {
      this.daysDisplaced += isBackwards ? -1 : isForwards ? +1 : 0;

      if (this.daysDisplaced === 0) {
        this.router.navigate(['remindersList']);
      } else if (isForwards) {
        this.router.navigate(['remindersList/forwards', this.daysDisplaced]);
      } else if (isBackwards) {
        this.router.navigate(['remindersList/backwards', this.daysDisplaced]);
      }
    } else this.router.navigate(['remindersList/forwards/1']);
  }

  loadData(userId: number | null = null): void {
    // If a userId has been specified, we search for that user's reminders.
    // If not, we search for the logged in user's reminders.
    if (userId) {
      this.store.dispatch(
        fetchAllUserReminders({
          userId: userId,
          day: this.day,
        })
      );
    } else {
      this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
        this.store.dispatch(
          fetchAllUserReminders({
            userId: (user! as UserDTO).id,
            day: this.day,
          })
        );

        if ((user! as UserDTO).role === 'caretaker') {
          this.store.dispatch(
            fetchCaretakerRelationships({ userId: (user! as UserDTO).id })
          );
        } else if ((user! as UserDTO).role === 'family member') {
          this.store.dispatch(
            fetchFamilyMemberRelationships({ userId: (user! as UserDTO).id })
          );
        } else this.isPatient = true;
      });
    }

    this.store
      .select(medicineSelectors.selectReminders)
      .pipe(debounceTime(500))
      .subscribe((reminders: ReminderDTO[]) => {
        this.organizedReminders = this.organizeReminders(reminders);
      });
  }

  // Cómo represento que un reminder ha sido consumido?
  // Nueva tabla "consumiciones" enlazada a los reminders
  // Cada vez que se marca como consumido, se agrega una fila a la tabla

  private organizeReminders(
    reminders: ReminderDTO[]
  ): Array<[Date, ReminderDTO[]]> {
    if (!reminders) return [];

    let organizedReminders: { [hora: string]: ReminderDTO[] } = {};

    reminders.forEach((reminder) => {
      let originalDate = new Date(this.day);
      const nextDay = new Date(this.day);
      nextDay.setDate(nextDay.getDate() + 1);

      let nextDose = this.reminderService.getNextDoseTime(
        reminder,
        originalDate
      );

      while (nextDose.getTime() <= nextDay.getTime()) {
        if (organizedReminders[nextDose.toString()]) {
          organizedReminders[nextDose.toString()].push(reminder);
        } else {
          organizedReminders[nextDose.toString()] = [reminder];
        }

        // Actualizamos la fecha para la próxima dosis
        originalDate = new Date(nextDose);
        nextDose = this.reminderService.getNextDoseTime(reminder, originalDate);
      }
    });

    // Convertimos a array y ordenamos por hora
    const resultArray: [Date, ReminderDTO[]][] = Object.entries(
      organizedReminders
    )
      .map(
        ([hora, reminders]) =>
          [new Date(hora), reminders] as [Date, ReminderDTO[]]
      )
      .sort(([horaA], [horaB]) => {
        return horaA.getTime() - horaB.getTime();
      });

    return resultArray;
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
