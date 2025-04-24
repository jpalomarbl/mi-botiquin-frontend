import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { Router } from '@angular/router';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

import { MedicineKitService } from 'src/app/Services/medicineKit.service';
import * as medicineActions from 'src/app/Store/medicine/actions/medicine.actions';

import { NextDosePipe } from 'src/app/Pipes/next-dose.pipe';
import { HeaderComponent } from '../../Common/header/header.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    HeaderComponent,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    NextDosePipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  todaysReminders$ = this.store.select(medicineSelectors.selectReminders);
  user$ = this.store.select(selectUser);
  loading$ = this.store.select(medicineSelectors.selectMedicineLoading);

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router
  ) {}
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

  navigateReminders(): void {
    this.router.navigate([]);
  }
}
