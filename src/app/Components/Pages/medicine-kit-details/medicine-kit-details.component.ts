// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Rxjs
import { Observable } from 'rxjs';

// Angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatCardModule} from '@angular/material/card';

// Data models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';

// Store
import { Store } from '@ngrx/store';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import { selectMedicineKitById } from 'src/app/Store/medicine/selectors/medicine.selectors';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Pipes
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-medicine-kit-details',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ScrollingModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './medicine-kit-details.component.html',
  styleUrls: ['./medicine-kit-details.component.scss'],
})
export class MedicineKitDetailsComponent {
  medicineKit$: Observable<MedicineKitDTO | undefined>;

  medicineKitId: number | undefined;

  medicines: MedicineDTO[] | undefined;
  sortedMedicines: MedicineDTO[] | undefined;

  constructor(
    private store: Store<GlobalStateDTO>,
    private route: ActivatedRoute
  ) {
    this.medicineKitId = +this.route.snapshot.params['medicineKitId'];

    this.medicineKit$ = this.store.select(
      selectMedicineKitById(+this.medicineKitId)
    );

    this.medicines = [];
    this.sortedMedicines = [];
  }

  ngOnInit(): void {
    if (this.medicineKitId) {
      this.store.dispatch(
        medicineKitActions.fetchMedicineKitById({
          medicineKitId: +this.medicineKitId,
        })
      );

      this.medicineKit$.subscribe((medicineKit) => {
        this.medicines = medicineKit!.medicines;
        this.sortedMedicines = medicineKit!.medicines;
      });
    }
  }

  orderMedicineKits(sortingMethod: number): void {
    if (sortingMethod === 1) this.sortedMedicines!.sort(this.compareDates);
    else this.sortedMedicines = this.medicines;
  }

  deleteMedicine(medicineId: number): void {
    
  }

  private compareDates(medicineA: MedicineDTO, medicineB: MedicineDTO): number {
    if (medicineA.expirationDate.getTime() < medicineB.expirationDate.getTime())
      return -1;
    else if (
      medicineA.expirationDate.getTime() > medicineB.expirationDate.getTime()
    )
      return 1;
    else return 0;
  }
}
