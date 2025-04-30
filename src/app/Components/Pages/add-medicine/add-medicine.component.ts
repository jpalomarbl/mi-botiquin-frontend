// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Angular material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Store
import { Store } from '@ngrx/store';
import { MedicineKitService } from 'src/app/Services/medicineKit.service';

// Models
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';

import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import 'moment/locale/es';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    MatButtonModule,
    MatIconModule,
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
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AddMedicineComponent {
  medicine: MedicineDTO;
  reminder: ReminderDTO;
  startDateData: Date;
  startTimeData: string;
  finishDateData: Date;
  finishTimeData: string;
  medicineKitId: number;

  addReminder: boolean;
  medicineUnitsArray: Array<[string, string[]]>;

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
    private store: Store
  ) {
    this.medicine = JSON.parse(
      decodeURIComponent(this.route.snapshot.params['medicine'])
    );
    this.medicineKitId = this.route.snapshot.params['medicineKitId'];

    this.reminder = {
      frequency: 0,
      frequencyUnit: 'horas',
      start: new Date(),
      finish: new Date(),
      amount: 0,
      medicineUnit: '',
    };

    this.startDateData = new Date();
    this.startTimeData = '';
    this.finishDateData = new Date();
    this.finishTimeData = '';

    this.addReminder = false;
    this.medicineUnitsArray = [];

    this.expirationDate = new FormControl(this.medicine.expirationDate, Validators.required);
    this.amountMedicine = new FormControl(this.medicine.amount, [Validators.required, Validators.min(0)]);
    this.unitMedicine = new FormControl(this.medicine.unit, Validators.required);

    this.amountReminder = new FormControl(this.reminder.amount, [Validators.required, Validators.min(1)]);
    this.frequency = new FormControl(this.reminder.frequency, [Validators.required, Validators.min(1)]);
    this.frequencyUnit = new FormControl(this.reminder.frequencyUnit, Validators.required);
    this.startDate = new FormControl(this.startDateData, Validators.required);
    this.startTime = new FormControl(this.startTimeData, Validators.required);
    this.finishDate = new FormControl(this.finishDateData || null, { nonNullable: true });
    this.finishTime = new FormControl(this.finishTimeData|| null, { nonNullable: true });

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
        this.medicineUnitsArray.push(Object.entries(item[1])[0]);
      });
    });

    const medicine: MedicineDTO = {
      name: 'medicinetest3',
      unit: 'medicinetest3',
      amount: 1,
      dose: 1,
      expirationDate: new Date(),
      nregistro: 1,
    };

    const medicineKitId = 2;

    const reminder = {
      frequency: 1,
      frequencyUnit: 'horas',
      start: new Date(),
      finish: new Date(),
      amount: 1,
      medicineUnit: 'medicinetest3',
    };

    // this.store.dispatch(medicineKitActions.addMedicine({ medicine: medicine, reminder: reminder, medicineKitId: 2}));

    // this.reminderService.addReminder(this.reminder, 30).subscribe((response) => {
    //   console.log(response)
    // })
  }

  submitForms(): void {
    console.log('expirationDate:', this.expirationDate.valid);
    console.log('amountMedicine:', this.amountMedicine.valid);
    console.log('unitMedicine:', this.unitMedicine.valid);

    // const start = this.startDate.value;
    // start.setHours(+this.startTime.value.slice(0, 2));
    // start.setMinutes(+this.startTime.value.slice(3, 5))

    // const finish = this.finishDate.value;
    // finish.setHours(+this.finishTime.value.slice(0, 2));
    // finish.setMinutes(+this.finishTime.value.slice(3, 5))

    console.log('amountReminder:', this.amountReminder.valid);
    console.log('frequency:', this.frequency.valid);
    console.log('frequencyUnit:', this.frequencyUnit.valid);
    console.log('start:', this.startDate.valid);
    console.log('startTime:', this.startTime.valid);
    console.log('finish:', this.finishDate.valid);
    console.log('finishTime:', this.finishTime.errors);
    console.log('finishTime:', this.finishTime.errors);
    console.log("MEDICINE FORM", this.medicineForm.valid)
    console.log("REMINDER FORM", this.reminderForm.valid)
  }
}
