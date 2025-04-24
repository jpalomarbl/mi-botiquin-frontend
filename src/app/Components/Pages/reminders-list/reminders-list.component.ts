import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss'],
})
export class RemindersListComponent {
  user$ = this.store.select(selectUser);

  constructor(private store: Store<GlobalStateDTO>) {}

  ngOnInit() {
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        reminderActions.fetchAllUserReminders({
          userId: (user! as UserDTO).id,
        })
      );
    });
  }
}
