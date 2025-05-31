// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';
import { DialogService } from 'src/app/Services/dialog.service';
import { MedicineKitService } from 'src/app/Services/medicineKit.service';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';

// Models
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { deleteReminder } from 'src/app/Store/medicine/actions/reminder.actions';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss'],
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
    private router: Router,
    private dialogService: DialogService,
    private actions$: Actions,
    public dialog: MatDialog
  ) {
    // We get the medicine information and medicine kit id from the route
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

    // If we are updating an existing medicine, we set the medicine and reminder objects with the existing information.
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

      this.finishDate.setValue(this.reminder.finish);
      this.finishTime.setValue(`${hours}:${minutes}`);
    }

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
    // Get medicine units array from JSON file on /src/assets folder
    this.medicineKitService.getMedicineUnitsArray().subscribe((array) => {
      Object.entries(array).forEach((item) => {
        this.medicineUnitsArray.push(Object.entries(item[1]));
      });
    });

    // Error dialog handling
    this.actions$
      .pipe(
        ofType(
          medicineKitActions.addMedicineError,
          medicineKitActions.updateMedicineError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });

    // Success dialog handling
    this.actions$
      .pipe(
        ofType(
          medicineKitActions.addMedicineSuccess
        ),
        take(1)
      )
      .subscribe(() => {
        this.dialogService.openSuccessDialog(
          {
            title: 'Medicamento agregado',
            message: 'Se ha agregado el nuevo medicamento al botiquín.',
          },
          this.dialog
        );
      });

    this.actions$
      .pipe(
        ofType(
          medicineKitActions.updateMedicineSuccess
        ),
        take(1)
      )
      .subscribe(() => {
        this.dialogService.openSuccessDialog(
          {
            title: 'Medicamento actualizado',
            message: 'Se ha actualizado el medicamento.',
          },
          this.dialog
        );
      });
  }

  // Dispatches the right actions depeding on whether if it is a medicine update or a new insert,
  // and if there is a reminder.
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
      start.setSeconds(0);
      start.setMilliseconds(0);

      let finish = new Date();

      if (this.finishDate.value) {
        finish = new Date(this.finishDate.value);

        if (this.finishTime.value) {
          finish.setHours(+this.finishTime.value.slice(0, 2));
          finish.setMinutes(+this.finishTime.value.slice(3, 5));
          finish.setSeconds(0);
          finish.setMilliseconds(0);
        }

        reminder.finish = finish;
      }

      reminder.start = start;

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
            ? medicineKitActions.updateMedicine({
                medicine: medicine,
                reminder: reminder,
                medicineKitId: +this.medicineKitId,
                createReminder: this.medicine.reminder === null,
              })
            : medicineKitActions.addMedicine({
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
            ? medicineKitActions.updateMedicine({
                medicine: medicine,
                medicineKitId: +this.medicineKitId,
                createReminder: false,
              })
            : medicineKitActions.addMedicine({
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
    this.dialogService.openConfirmationDialog(
      {
        title: '¿Eliminar recordatorio?',
        message: '¿Estás seguro de eliminar este recordatorio?',
        route: 'medicineKitDetails/' + this.medicineKitId,
        action: deleteReminder({
          medicineKitId: +this.medicineKitId,
          medicineId: +this.medicine.id!,
          reminderId: +this.reminder.id!,
        }),
      },
      this.dialog
    );
  }
}
