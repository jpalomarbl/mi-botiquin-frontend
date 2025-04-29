import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { Observable, take } from 'rxjs';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKits.actions';
import * as medicineKitSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';

// Angular material
import { ScrollingModule } from '@angular/cdk/scrolling';


@Component({
  selector: 'app-search-medicine',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, ScrollingModule],
  templateUrl: './search-medicine.component.html',
  styleUrls: ['./search-medicine.component.scss'],
})
export class SearchMedicineComponent {
  medicine: FormControl;
  medicineForm: FormGroup;

  medicineName: string;

  medicinesSearch: MedicineDTO[];
  medicinesSearch$: Observable<MedicineDTO[]>;

  constructor(private store: Store<GlobalStateDTO>, private actions$: Actions) {
    this.medicineName = '';
    this.medicinesSearch = [];

    this.medicine = new FormControl(this.medicineName, Validators.required);

    this.medicineForm = new FormGroup({
      medicine: this.medicine,
    });

    this.medicinesSearch$ = this.store.select(
      medicineKitSelectors.selectMedicinesSearch
    );
  }

  ngOnInit(): void {
    this.store.dispatch(
      medicineKitActions.fetchMedicinesCIMA({ medicineName: 'ibuprofeno' })
    );

    this.actions$
      .pipe(
        ofType(medicineKitActions.fetchMedicinesCIMASuccess),
        take(1) // Para autodesuscribirse después de ejecutarse una vez
      )
      .subscribe(() => {
        // Código a ejecutar después de eliminar
        this.medicinesSearch$.subscribe((medicines: MedicineDTO[]) => {
          this.medicinesSearch = medicines;
        });
      });
  }
}
