// Angular
import { Component } from '@angular/core';

// Rxjs and Redux
import { Observable } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
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
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './medicine-kits-list.component.html',
  styleUrls: ['./medicine-kits-list.component.scss'],
})
export class MedicineKitsListComponent {
  user$: Observable<UserDTO | null>;
  medicineKits$: Observable<MedicineKitDTO[]>;

  constructor(private store: Store<GlobalStateDTO>) {
    this.user$ = this.store.select(selectUser);
    this.medicineKits$ = this.store.select(
      medicineSelectors.selectMedicineKits
    );
  }

  ngOnInit(): void {
    this.user$.subscribe((user: UserDTO | null) => {
      if (user) {
        this.store.dispatch(
          medicineKitActions.fetchUserMedicineKits({
            userId: user.id,
            role: user.role,
          })
        );
      }
    });
  }
}
