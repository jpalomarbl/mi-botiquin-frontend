// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Rxjs
import { debounceTime, Observable, Subject, take, takeUntil } from 'rxjs';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import { MedicineKitService } from 'src/app/Services/medicineKit.service';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import * as medicineKitSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';
import { selectMedicineLoading } from 'src/app/Store/medicine/selectors/medicine.selectors';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';

// Angular material
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search-medicine',
  templateUrl: './search-medicine.component.html',
  styleUrls: ['./search-medicine.component.scss'],
})
export class SearchMedicineComponent {
  loading$: Observable<boolean>;

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
    private medicineKitService: MedicineKitService,
    private dialogService: DialogService,
    public errorDialog: MatDialog
  ) {
    this.loading$ = this.store.select(selectMedicineLoading);

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
        take(1)
      )
      .subscribe(() => {
        this.medicinesSearch$.subscribe((medicines: MedicineDTO[]) => {
          this.medicinesSearch = medicines;
        });
      });

    this.medicine.valueChanges
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.store.dispatch(
          medicineKitActions.fetchMedicinesCIMA({ medicineName: value })
        );
      });

      // Error dialog handling
    this.actions$
      .pipe(ofType(medicineKitActions.fetchMedicinesCIMAError), take(1))
      .subscribe((error) => {
        this.dialogService.openErrorDialog('No se han podido obtener los medicamentos', this.errorDialog);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateAddMedicine(medicine: MedicineDTO) {
    // Custom debouncer
    const now = Date.now();
    if (now - this.lastClickTime < 500) return;
    this.lastClickTime = now;

    const medicineItem: MedicineDTO = {
      ...medicine,
    };

    const medicineKitId = this.route.snapshot.params['medicineKitId'];

    this.medicineKitService
      .getMedicineUnit(
        medicine.viaAdmininstracion!,
        medicine.formaFarmaceuticaSimplificada!
      )
      .subscribe((unit: string) => {
        medicineItem.unit = unit;

        const medicineJSON = encodeURIComponent(JSON.stringify(medicineItem));

        this.router.navigate([`/addMedicine/${medicineKitId}/${medicineJSON}`]);
      });
  }
}
