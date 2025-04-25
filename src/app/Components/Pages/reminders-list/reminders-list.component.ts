import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule } from 'src/app/Modules/forms.module';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { DateFormatPipe } from 'src/app/Pipes/date-format.pipe';
import { ReminderService } from 'src/app/Services/reminder.service';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

import { selectReminders } from 'src/app/Store/medicine/selectors/medicine.selectors';

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

  amount: number;
  day: Date;
  today: Date;

  isYesterday: boolean;
  isTomorrow: boolean;
  isToday: boolean;

  // datePicker: FormControl;
  // datePickerForm: FormGroup;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private route: ActivatedRoute,
    private reminderService: ReminderService,
    private datePipe: DatePipe
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.day = new Date(this.today);

    // this.datePicker = new FormControl(this.today);
    // this.datePickerForm = new FormGroup({
    //   datePicker: this.datePicker,
    // });

    this.amount = this.route.snapshot.params['amount']
      ? +this.route.snapshot.params['amount']
      : 0;

    if (this.amount > 0) {
      if (this.router.url.includes('forward')) {
        this.day.setDate(this.day.getDate() + this.amount);
      } else if (this.router.url.includes('back')) {
        this.day.setDate(this.day.getDate() - this.amount);
      }
    }

    this.isYesterday = this.router.url.includes('back') && this.amount === 1;
    this.isTomorrow = this.router.url.includes('forward') && this.amount === 1;
    this.isToday = this.amount === 0;
  }

  ngOnInit() {
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        reminderActions.fetchAllUserReminders({
          userId: (user! as UserDTO).id,
          day: this.day,
        })
      );
    });

    this.store.select(selectReminders).subscribe((reminders: ReminderDTO[]) => {
      console.log(this.organizeReminders(reminders));
    });
  }

  navigateToPreviousDay() {
    if (this.amount > 0) {
      if (this.router.url.includes('back')) {
        this.amount++;
      } else if (this.router.url.includes('forward')) {
        this.amount--;
      }

      if (this.amount === 0) this.router.navigate(['remindersList']);
      else this.router.navigate(['remindersList/back', this.amount]);
    } else this.router.navigate(['remindersList/back/1']);
  }

  navigateToNextDay() {
    if (this.amount > 0) {
      if (this.router.url.includes('back')) {
        this.amount--;
      } else if (this.router.url.includes('forward')) {
        this.amount++;
      }

      if (this.amount === 0) this.router.navigate(['remindersList']);
      else this.router.navigate(['remindersList/forward', this.amount]);
    } else this.router.navigate(['remindersList/forward/1']);
  }

  // Cómo represento que un reminder ha sido consumido?

  private organizeReminders(
    reminders: ReminderDTO[]
  ): { [hora: string]: ReminderDTO[] } {
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
}
