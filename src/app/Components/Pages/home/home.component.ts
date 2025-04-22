import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

import * as medicineActions from 'src/app/Store/medicine/actions/medicine.actions';
import { MedicineKitService } from 'src/app/Store/medicine/services/medicineKit.service';

import { HeaderComponent } from '../../Common/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AsyncPipe, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  todaysReminders$ = this.store.select(medicineSelectors.selectReminders);
  user$ = this.store.select(selectUser);

  constructor(private store: Store<GlobalStateDTO>, private medicineKitService: MedicineKitService) {}
  ngOnInit() {
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        medicineActions.fetchUserRemindersForToday({
          userId: (user! as UserDTO).id,
        })
      );

      this.store.dispatch(
        medicineActions.fetchUserMedicineKits({
          userId: (user! as UserDTO).id,
          role: (user! as UserDTO).role,
        })
      );
    });
  }
}
