import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { FormsModule } from 'src/app/Modules/forms.module';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss'],
})
export class RemindersListComponent {
  user$ = this.store.select(selectUser);

  amount: number | undefined;
  day: Date;
  today: Date;

  // datePicker: FormControl;
  // datePickerForm: FormGroup;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.day = new Date(this.today);

    // this.datePicker = new FormControl(this.today);
    // this.datePickerForm = new FormGroup({
    //   datePicker: this.datePicker,
    // });

    this.amount = this.route.snapshot.params['amount'];

    if (this.amount) {
      if (this.router.url.includes('forward')) {
        this.day.setDate(this.day.getDate() + +this.amount);
      } else if (this.router.url.includes('back')) {
        this.day.setDate(this.day.getDate() - +this.amount);
      }
    }
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
  }
}
