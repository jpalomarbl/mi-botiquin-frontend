import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  wentBack = false;
  wentForward = false;
  amount = null;
  day = new Date();

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.router.url === '/remindersList/forward') this.wentForward = true;
    else if (this.router.url === '/remindersList/back') this.wentBack = true;

    this.route.queryParams.subscribe(params => {
      this.amount = params['amount'];

      if (this.amount) {
        if (this.wentBack) {
          this.day.setDate(this.day.getDate() - (+this.amount));
        } else if (this.wentForward) {
          this.day.setDate(this.day.getDate() + (+this.amount));
        }
      }
    });

    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        reminderActions.fetchAllUserReminders({
          userId: (user! as UserDTO).id,
          day: this.day,
        })
      );
    });
  }
}
