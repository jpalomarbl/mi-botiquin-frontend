// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

// Custom modules
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { FormsModule } from 'src/app/Modules/forms.module';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { DialogService } from 'src/app/Services/dialog.service';
import { MedicineKitService } from 'src/app/Services/medicineKit.service';
import {
  addMedicine,
  addMedicineError,
  updateMedicine,
} from 'src/app/Store/medicine/actions/medicineKit.actions';

// Models
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

// Pipes
import { ShortenTextPipe } from 'src/app/Pipes/shorten-text.pipe';

import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import 'moment/locale/es';
import { deleteReminder } from 'src/app/Store/medicine/actions/reminder.actions';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    AngularMaterialModule,
    ShortenTextPipe,
  ],
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        display: {
          dateInput: 'MM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      },
    },
  ],
})
export class AddMedicineComponent {
  medicine: MedicineDTO;
  reminder: ReminderDTO;
  startDateData: Date;
  startTimeData: string;
  finishDateData: Date | undefined;
  finishTimeData: string;
  medicineKitId: number;

  isUpdateMode: boolean;

  addReminder: boolean;
  medicineUnitsArray: Array<[string, string[]]>[];

  expirationDate: FormControl;
  amountMedicine: FormControl;
  unitMedicine: FormControl;
  medicineForm: FormGroup;

  amountReminder: FormControl;
  frequency: FormControl;
  frequencyUnit: FormControl;
  startDate: FormControl;
  startTime: FormControl;
  finishDate: FormControl;
  finishTime: FormControl;
  reminderForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private medicineKitService: MedicineKitService,
    private store: Store,
    private router: Router,
    private dialogService: DialogService,
    private actions$: Actions,
    public dialog: MatDialog
  ) {
    this.medicine = JSON.parse(
      decodeURIComponent(this.route.snapshot.params['medicine'])
    );

    this.medicineKitId = this.route.snapshot.params['medicineKitId'];

    this.reminder = {
      id: 0,
      frequency: 0,
      frequencyUnit: 'horas',
      start: new Date(),
      amount: 0,
      medicineUnit: '',
    };

    if (this.router.url.includes('update')) {
      this.isUpdateMode = true;
    } else {
      this.isUpdateMode = false;
    }

    if (this.isUpdateMode) {
      this.medicine.expirationDate = new Date(this.medicine.expirationDate);

      if (this.medicine.reminder) {
        this.medicine.reminder.start = new Date(this.medicine.reminder.start);

        if (this.medicine.reminder.finish) {
          this.medicine.reminder.finish = new Date(
            this.medicine.reminder.finish
          );
        }

        this.reminder = this.medicine.reminder;
      }
    }

    this.startDateData = this.reminder.start;
    this.startTimeData = '';
    this.finishDateData = this.reminder.finish;
    this.finishTimeData = '';

    this.addReminder = false;
    this.medicineUnitsArray = [];

    this.expirationDate = new FormControl(
      this.medicine.expirationDate,
      Validators.required
    );
    this.amountMedicine = new FormControl(this.medicine.amount, [
      Validators.required,
      Validators.min(0),
    ]);
    this.unitMedicine = new FormControl(
      this.medicine.unit,
      Validators.required
    );

    this.amountReminder = new FormControl(this.reminder.amount, [
      Validators.required,
      Validators.min(1),
    ]);
    this.frequency = new FormControl(this.reminder.frequency, [
      Validators.required,
      Validators.min(1),
    ]);
    this.frequencyUnit = new FormControl(
      this.reminder.frequencyUnit,
      Validators.required
    );

    this.startDate = new FormControl(this.startDateData, Validators.required);
    this.startTime = new FormControl(this.startTimeData, Validators.required);

    this.finishDate = new FormControl(this.finishDateData || null, {
      nonNullable: true,
    });
    this.finishTime = new FormControl(this.finishTimeData || null, {
      nonNullable: true,
    });

    let hours =
      this.reminder.start.getHours().toString().length === 2
        ? this.reminder.start.getHours().toString()
        : '0' + this.reminder.start.getHours().toString();

    let minutes =
      this.reminder.start.getMinutes().toString().length === 2
        ? this.reminder.start.getMinutes().toString()
        : '0' + this.reminder.start.getMinutes().toString();

    this.startDate.setValue(this.reminder.start);
    this.startTime.setValue(`${hours}:${minutes}`);

    if (this.reminder.finish) {
      hours =
        this.reminder.finish.getHours().toString().length === 2
          ? this.reminder.finish.getHours().toString()
          : '0' + this.reminder.finish.getHours().toString();

      minutes =
        this.reminder.finish.getMinutes().toString().length === 2
          ? this.reminder.finish.getMinutes().toString()
          : '0' + this.reminder.finish.getMinutes().toString();
    }

    this.finishDate.setValue(this.reminder.finish);
    this.finishTime.setValue(`${hours}:${minutes}`);

    this.medicineForm = new FormGroup({
      expirationDate: this.expirationDate,
      amountMedicine: this.amountMedicine,
      unitMedicine: this.unitMedicine,
    });

    this.reminderForm = new FormGroup({
      amountReminder: this.amountReminder,
      frequency: this.frequency,
      frequencyUnit: this.frequencyUnit,
      startDate: this.startDate,
      startTime: this.startTime,
      finishDate: this.finishDate,
      finishTime: this.finishTime,
    });
  }

  ngOnInit(): void {
    this.medicineKitService.getMedicineUnitsArray().subscribe((array) => {
      Object.entries(array).forEach((item) => {
        this.medicineUnitsArray.push(Object.entries(item[1]));
      });
    });

    this.actions$.pipe(ofType(addMedicineError), take(1)).subscribe((error) => {
      this.dialogService.openErrorDialog(error.error, this.dialog);
    });
  }

  submitForms(): void {
    let medicine = {
      ...this.medicine,
      expirationDate: this.expirationDate.value,
      amount: this.amountMedicine.value,
      unit: this.unitMedicine.value,
    };

    if (this.addReminder) {
      let reminder = {
        ...this.reminder,
        frequency: this.frequency.value,
        frequencyUnit: this.frequencyUnit.value,
        amount: this.amountReminder.value,
        medicineUnit: this.unitMedicine.value,
      };

      let start = this.startDate.value;
      start.setHours(+this.startTime.value.slice(0, 2));
      start.setMinutes(+this.startTime.value.slice(3, 5));

      let finish = new Date();

      if (this.finishDate.value) {
        finish = new Date(this.finishDate.value);

        if (this.finishTime.value) {
          finish.setHours(+this.finishTime.value.slice(0, 2));
          finish.setMinutes(+this.finishTime.value.slice(3, 5));
        }
      }

      reminder.start = start;
      reminder.finish = finish;


      let translatedUnit = '';

      if (reminder.frequencyUnit === 'minutes') translatedUnit = 'minutos';
      else if (reminder.frequencyUnit === 'hours') translatedUnit = 'horas';
      else if (reminder.frequencyUnit === 'days') translatedUnit = 'días';

      this.dialogService.openConfirmationDialog(
        {
          title: '¿Añadir medicamento y recordatorio?',
          message:
            '¿Estás seguro de añadir ' +
            medicine.name +
            '(' +
            medicine.amount +
            ' ' +
            medicine.unit +
            '), con un recordatorio cada ' +
            reminder.frequency +
            ' ' +
            translatedUnit +
            ' al botiquín?',
          action: this.isUpdateMode
            ? updateMedicine({
                medicine: medicine,
                reminder: reminder,
                medicineKitId: +this.medicineKitId,
                createReminder: this.medicine.reminder === null
              })
            : addMedicine({
                medicine: medicine,
                reminder: reminder,
                medicineKitId: +this.medicineKitId,
              }),
          route: 'medicineKitDetails/' + this.medicineKitId,
        },
        this.dialog
      );
    } else {
      this.dialogService.openConfirmationDialog(
        {
          title: '¿Añadir medicamento?',
          message:
            '¿Estás seguro de añadir ' +
            medicine.name +
            ' (' +
            medicine.amount +
            ' ' +
            medicine.unit +
            ') ' +
            'al botiquín?',
          action: this.isUpdateMode
            ? updateMedicine({
                medicine: medicine,
                medicineKitId: +this.medicineKitId,
                createReminder: false
              })
            : addMedicine({
                medicine: medicine,
                medicineKitId: +this.medicineKitId,
              }),
          route: 'medicineKitDetails/' + this.medicineKitId,
        },
        this.dialog
      );
    }
  }

  deleteReminder(): void {
    console.log(this.reminder)
    this.dialogService.openConfirmationDialog(
      {
        title: '¿Eliminar recordatorio?',
        message: '¿Estás seguro de eliminar este recordatorio?',
        route: 'medicineKitDetails/' + this.medicineKitId,
        action: deleteReminder({
          medicineKitId: +this.medicineKitId,
          medicineId: +this.medicine.id!,
          reminderId: +this.reminder.id!
        })
      }, this.dialog
    );
  }

  openDatePicker(dp: any) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?: any) {
    // Get month and year from eventData and close datepicker, thus not allowing user to select date
    this.expirationDate.setValue(eventData._d);

    dp.close();
  }
}
