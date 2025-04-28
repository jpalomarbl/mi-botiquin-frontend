// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Rxjs and Redux
import { Observable } from 'rxjs';

// Angular material
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

// Store
import { Store } from '@ngrx/store';
import * as userRelationshipActions from 'src/app/Store/auth/actions/userRelationships.actions';
import {
  selectAuthLoading,
  selectUser,
  selectUserRelationships,
} from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

//Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Data models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-medicine-kits-list',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MatSelectModule,
    MatCardModule,
    ScrollingModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './medicine-kits-list.component.html',
  styleUrls: ['./medicine-kits-list.component.scss'],
})
export class MedicineKitsListComponent {
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;
  medicineKits$: Observable<MedicineKitDTO[]>;

  loadingMedicine$: Observable<boolean>;
  loadingAuth$: Observable<boolean>;

  userId: number;

  isPatient: boolean;

  constructor(private store: Store<GlobalStateDTO>, private router: Router) {
    this.user$ = this.store.select(selectUser);
    this.userRelationships$ = this.store.select(selectUserRelationships);

    this.medicineKits$ = this.store.select(
      medicineSelectors.selectMedicineKits
    );

    this.loadingMedicine$ = this.store.select(
      medicineSelectors.selectMedicineLoading
    );
    this.loadingAuth$ = this.store.select(selectAuthLoading);

    this.userId = 0;

    this.isPatient = false;
  }

  ngOnInit(): void {
    this.loadData(this.userId);
  }

  loadData(userId: number, role: string = 'patient'): void {
    this.userId = userId;

    if (userId > 0) {
      this.store.dispatch(
        medicineKitActions.fetchUserMedicineKits({
          userId: userId,
          role: role,
        })
      );
    } else {
      this.user$.subscribe((user: UserDTO | null) => {
        if (user) {
          this.store.dispatch(
            medicineKitActions.fetchUserMedicineKits({
              userId: user.id,
              role: user.role,
            })
          );

          if (user.role === 'caretaker') {
            this.store.dispatch(
              userRelationshipActions.fetchCaretakerRelationships({
                userId: user.id,
              })
            );
          } else if (user.role === 'family member') {
            this.store.dispatch(
              userRelationshipActions.fetchFamilyMemberRelationships({
                userId: user.id,
              })
            );
          } else this.isPatient = true;
        }
      });
    }
  }

  navigateMedicineKitDetails(medicineKitId: number): void {
    this.router.navigate(['medicineKitDetails/' + medicineKitId.toString()]);
  }
}
