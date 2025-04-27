import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

import {
  selectUser,
  selectUserRelationships,
} from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

import { fetchCaretakerRelationships, fetchFamilyMemberRelationships } from 'src/app/Store/auth/actions/userRelationships.actions';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import * as reminderActions from 'src/app/Store/medicine/actions/reminders.actions';

import { NextDosePipe } from 'src/app/Pipes/next-dose.pipe';
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    HeaderComponent,
    FooterComponent,
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
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;

  loading$: Observable<boolean>;

  todaysReminders$: Observable<ReminderDTO[]>;
  medicineKits$: Observable<MedicineKitDTO[]>;

  user: UserDTO | null;
  isPatient: boolean;

  constructor(private store: Store<GlobalStateDTO>, private router: Router) {
    this.user$ = this.store.select(selectUser);
    this.userRelationships$ = this.store.select(selectUserRelationships);

    this.loading$ = this.store.select(medicineSelectors.selectMedicineLoading);

    this.todaysReminders$ = this.store.select(
      medicineSelectors.selectReminders
    );
    this.medicineKits$ = this.store.select(
      medicineSelectors.selectMedicineKits
    );

    this.user = null;

    this.isPatient = false;
  }

  ngOnInit() {
    this.user$.pipe(filter((user) => user !== null)).subscribe((user) => {
      this.store.dispatch(
        reminderActions.fetchUserRemindersForToday({
          userId: (user! as UserDTO).id,
        })
      );

      this.store.dispatch(
        medicineKitActions.fetchUserMedicineKits({
          userId: (user! as UserDTO).id,
          role: (user! as UserDTO).role,
        })
      );

      if ((user! as UserDTO).role === 'caretaker') {
        this.store.dispatch(
          fetchCaretakerRelationships({ userId: (user! as UserDTO).id })
        );
      } else if ((user! as UserDTO).role === 'family member') {
        this.store.dispatch(
          fetchFamilyMemberRelationships({ userId: (user! as UserDTO).id })
        );
      } else this.isPatient = true;

      this.user = user! as UserDTO;
    });
  }

  navigateRemindersList(): void {
    this.router.navigate(['/remindersList']);
  }

  navigateMedicineKitsList(): void {
    this.router.navigate([]);
  }

  navigateMedicineKitDetails(medicineKitId: number): void {
    this.router.navigate([]);
  }
}
