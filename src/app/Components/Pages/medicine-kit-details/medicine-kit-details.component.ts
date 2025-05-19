// Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Rxjs
import { Observable, take } from 'rxjs';

// Angular material
import { MatDialog } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

// Data models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import { selectMedicineKitById } from 'src/app/Store/medicine/selectors/medicine.selectors';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';

// Pipes
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-medicine-kit-details',
  standalone: true,
  imports: [FooterComponent, AsyncPipe, AngularMaterialModule, CommonModule],
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
    private actions$: Actions,
    private router: Router,
    private dialogService: DialogService,
    public dialog: MatDialog
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

    this.actions$
      .pipe(
        ofType(
          medicineKitActions.fetchMedicineKitByIdError,
          medicineKitActions.deleteMedicineByIdError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });
  }

  orderMedicineKits(sortingMethod: number): void {
    const sorted: MedicineDTO[] = [...this.medicines];

    if (sortingMethod === 1)
      this.sortedMedicines = sorted.sort(this.compareDates);
    else this.sortedMedicines = this.medicines;
  }

  deleteMedicine(medicineId: number): void {
    this.medicineKit$.pipe(take(1)).subscribe((medicineKit) => {
      this.dialogService.openConfirmationDialog(
        {
          title: '¿Eliminar medicamento?',
          message:
            '¿Estás seguro de eliminar este medicamento? También se eliminarán los recordatorios asociados.',
          route: '/medicineKitDetails/' + medicineKit!.id,
          action: medicineKitActions.deleteMedicineById({
            medicineId: medicineId,
            medicineKitId: medicineKit!.id,
          }),
        },
        this.dialog
      );
    });
  }

  navigateAddMedicine(): void {
    this.router.navigate([`searchMedicine/${this.medicineKit!.id}`]);
  }

  navigateEditMedicine(medicine: MedicineDTO): void {
    const medicineJSON = encodeURIComponent(JSON.stringify(medicine));

    this.router.navigate([
      `/addMedicine/update/${this.medicineKitId}/${medicineJSON}`,
    ]);
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
