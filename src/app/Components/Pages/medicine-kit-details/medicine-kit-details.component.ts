// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Rxjs
import { Observable, take } from 'rxjs';

// Angular material
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Data models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';

// Store
import { Actions, ofType } from '@ngrx/effects';
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
  medicineKit: MedicineKitDTO | null;

  medicineKitId: number | undefined;

  medicines: Array<MedicineDTO>;
  sortedMedicines: Array<MedicineDTO>;

  lastClickTime: number;

  constructor(
    private store: Store<GlobalStateDTO>,
    private route: ActivatedRoute,
    private actions$: Actions
  ) {
    this.medicineKitId = +this.route.snapshot.params['medicineKitId'];

    this.medicineKit$ = this.store.select(
      selectMedicineKitById(+this.medicineKitId)
    );

    this.medicineKit = null;

    this.medicines = [];
    this.sortedMedicines = [];
    this.lastClickTime = 0;
  }

  ngOnInit(): void {
    if (this.medicineKitId) {
      this.store.dispatch(
        medicineKitActions.fetchMedicineKitById({
          medicineKitId: +this.medicineKitId,
        })
      );

      this.medicineKit$.subscribe((medicineKit) => {
        if (medicineKit && medicineKit.medicines) {
          this.medicines = medicineKit.medicines;
          this.sortedMedicines = medicineKit.medicines;

          this.medicineKit = medicineKit;
        }
      });
    }
  }

  orderMedicineKits(sortingMethod: number): void {
    const sorted: MedicineDTO[] = [...this.medicines];

    if (sortingMethod === 1) this.sortedMedicines = sorted.sort(this.compareDates);
    else this.sortedMedicines = this.medicines;
  }

  deleteMedicine(medicineId: number): void {
    this.medicineKit$.pipe(take(1)).subscribe((medicineKit) => {
      this.store.dispatch(
        medicineKitActions.deleteMedicineById({
          medicineId: medicineId,
          medicineKitId: medicineKit!.id,
        })
      );
    });

    this.actions$
      .pipe(
        ofType(medicineKitActions.fetchMedicineKitByIdSuccess),
        take(1) // Para autodesuscribirse después de ejecutarse una vez
      )
      .subscribe(() => {
        // Código a ejecutar después de eliminar
        console.log('Medicina eliminada, actualizando vista...');
        this.sortedMedicines = this.sortedMedicines?.filter(
          (m) => m.id !== medicineId
        );
      });
  }

  private compareDates(medicineA: MedicineDTO, medicineB: MedicineDTO): number {
    console.log(medicineA.expirationDate.getTime() < medicineB.expirationDate.getTime());
    if (medicineA.expirationDate.getTime() < medicineB.expirationDate.getTime())
      return -1;
    else if (
      medicineA.expirationDate.getTime() > medicineB.expirationDate.getTime()
    )
      return 1;
    else return 0;
  }
}
