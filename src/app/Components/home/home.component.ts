import { Component } from '@angular/core';

import { ReminderService } from 'src/app/data/services/reminder.service';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  reminders: ReminderDTO[] = [];

  constructor(private reminderService: ReminderService) {}
  ngOnInit() {
    this.reminderService.getRemindersForToday().subscribe((response: ReminderDTO[]) => {
      this.reminders = response;
    });

    console.log(this.reminders);
  }

}
