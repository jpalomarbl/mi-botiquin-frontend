// Angular
import { Component } from '@angular/core';

// Router
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

// Ngrx and Observables
import { Store } from '@ngrx/store';
import { filter, distinctUntilChanged } from 'rxjs';
import { debounceTime } from 'rxjs';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import { fetchAllUserReminders } from 'src/app/Store/medicine/actions/reminders.actions';
import { selectReminders } from 'src/app/Store/medicine/selectors/medicine.selectors';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
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
    DateFormatPipe,
  ],
  providers: [DatePipe],
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss'],
})
export class RemindersListComponent {
  user$ = this.store.select(selectUser);

  // Amount of days displaced from today
  daysDisplaced: number;

  today: Date;

  // Day = today +/- daysDisplaced
  day: Date;

  // These control whether the user sees "Ayer", "Hoy" or "Mañana" on the date picker section
  isYesterday: boolean;
  isTomorrow: boolean;
  isToday: boolean;

  // Debounce control
  lastClickTime: number;

  // datePicker: FormControl;
  // datePickerForm: FormGroup;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private route: ActivatedRoute,
    private reminderService: ReminderService,
    private datePipe: DatePipe
  ) {
    // It's important that we set today's date at midnight because
    // we want to list every reminder form the day, not just from now.
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.day = new Date(this.today);

    // this.datePicker = new FormControl(this.today);
    // this.datePickerForm = new FormGroup({
    //   datePicker: this.datePicker,
    // });

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

    this.lastClickTime = 0;
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe(() => {
        this.loadDataOnChange();
      });


    // We fetch all user reminders and filter them for the specified day.
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        fetchAllUserReminders({
          userId: (user! as UserDTO).id,
          day: this.day,
        })
      );
    });

    this.store.select(selectReminders).pipe(
      debounceTime(500)
    ).subscribe((reminders: ReminderDTO[]) => {
      console.log(this.organizeReminders(reminders));
    });
  }

  navigateToPreviousDay() {
    const now = Date.now();
    if (now - this.lastClickTime < 500) return; // Evita múltiples clics en 500ms
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

  // Cómo represento que un reminder ha sido consumido?

  private organizeReminders(reminders: ReminderDTO[]): {
    [hora: string]: ReminderDTO[];
  } {
    let organizedReminders: { [hora: string]: ReminderDTO[] } = {};
    console.log(this.day);

    reminders.forEach((reminder) => {
      let originalDate = new Date(this.day);
      const nextDay = new Date(this.day);
      nextDay.setDate(nextDay.getDate() + 1);

      let nextDose = this.reminderService.getNextDoseTime(
        reminder,
        originalDate
      );

      while (nextDose.getTime() <= nextDay.getTime()) {
        const horaKey: string =
          this.datePipe.transform(nextDose, 'shortTime') || 'Hora inválida';

        if (organizedReminders[horaKey]) {
          organizedReminders[horaKey].push(reminder);
        } else {
          organizedReminders[horaKey] = [reminder];
        }

        // Actualizamos la fecha para la próxima dosis
        originalDate = new Date(nextDose);
        nextDose = this.reminderService.getNextDoseTime(reminder, originalDate);
      }
    });

    return organizedReminders;
  }

  private loadDataOnChange(): void {
    // It's important that we set today's date at midnight because
    // we want to list every reminder form the day, not just from now.
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.day = new Date(this.today);

    // this.datePicker = new FormControl(this.today);
    // this.datePickerForm = new FormGroup({
    //   datePicker: this.datePicker,
    // });

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

    this.lastClickTime = 0;

    // We fetch all user reminders and filter them for the specified day.
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        fetchAllUserReminders({
          userId: (user! as UserDTO).id,
          day: this.day,
        })
      );
    });
  }
}
