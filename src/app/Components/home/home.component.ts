import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { AuthStateDTO } from 'src/app/auth/models/auth.dto';
import { selectAuthLoading } from 'src/app/auth/selectors/auth.selectors';
import { selectUser } from 'src/app/auth/selectors/auth.selectors';
import { ReminderService } from 'src/app/data/services/reminder.service';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  reminders: ReminderDTO[] = [];
  user$ = this.store.select(selectUser);
  loading$ = this.store.select(selectAuthLoading);
  userId: number = 0;

  constructor(
    private reminderService: ReminderService,
    private store: Store<AuthStateDTO>
  ) {}
  ngOnInit() {
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.reminderService
        .getRemindersForToday(user!.id)
        .subscribe((response) => {
          console.log(response);
          this.reminders = response.map((row: ReminderDTO) => ({
            id: row.id,
            frequency: row.frequency,
            frequencyUnit: row.frequencyUnit,
            start: new Date(row.start),
            finish: new Date(row.finish),
            amount: row.amount,
            medicineId: row.medicineId,
            medicineUnit: row.medicineUnit,
            medicineName: row.medicineName,
            medicinKitName: row.medicineKitName,
          }));
        });
    });
  }
}
