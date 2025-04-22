import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

import * as medicineActions from 'src/app/Store/medicine/actions/medicine.actions';
import { ReminderService } from 'src/app/Store/medicine/services/reminder.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  todaysReminders$ = this.store.select(medicineSelectors.selectReminders);
  user$ = this.store.select(selectUser);

  constructor(
    private store: Store<GlobalStateDTO>
  ) {}
  ngOnInit() {
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        medicineActions.fetchUserRemindersForToday({
          userId: (user! as UserDTO).id,
        })
      );
    });
  }
}
