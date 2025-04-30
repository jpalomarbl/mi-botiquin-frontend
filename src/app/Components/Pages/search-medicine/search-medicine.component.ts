import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Rxjs
import { debounceTime, Observable, Subject, take, takeUntil } from 'rxjs';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MedicineKitService } from 'src/app/Services/medicineKit.service';
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
import { MatListModule } from '@angular/material/list';

//Pipes
import { ShortenTextPipe } from 'src/app/Pipes/shorten-text.pipe';

@Component({
  selector: 'app-search-medicine',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ScrollingModule,
    MatListModule,
    CommonModule,
    ShortenTextPipe,
  ],
  templateUrl: './search-medicine.component.html',
  styleUrls: ['./search-medicine.component.scss'],
})
export class SearchMedicineComponent {
  medicine: FormControl;
  medicineForm: FormGroup;

  medicineName: string;

  medicinesSearch: MedicineDTO[];
  medicinesSearch$: Observable<MedicineDTO[]>;

  lastClickTime: number;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<GlobalStateDTO>,
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private medicineKitService: MedicineKitService
  ) {
    this.medicineName = '';
    this.medicinesSearch = [];

    this.medicine = new FormControl(this.medicineName, Validators.required);

    this.medicineForm = new FormGroup({
      medicine: this.medicine,
    });

    this.medicinesSearch$ = this.store.select(
      medicineKitSelectors.selectMedicinesSearch
    );

    this.lastClickTime = 0;
  }

  ngOnInit(): void {
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

        console.log(this.medicinesSearch);
      });

    this.medicine.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.store.dispatch(
          medicineKitActions.fetchMedicinesCIMA({ medicineName: value })
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateAddMedicine(medicine: MedicineDTO) {
    const now = Date.now();
    if (now - this.lastClickTime < 500) return; // Evita múltiples clics en 500ms
    this.lastClickTime = now;

    const medicineItem: MedicineDTO = {
      ...medicine,
    };

    const medicineKitId = this.route.snapshot.params['medicineKitId'];

    medicineItem.unit = this.medicineKitService.getMedicineUnit(
      medicine.viaAdmininstracion!,
      medicine.formaFarmaceuticaSimplificada!
    );

    const medicineJSON = encodeURIComponent(JSON.stringify(medicineItem));

    this.router.navigate([`/addMedicine/${medicineKitId}/${medicineJSON}`]);
  }
}
