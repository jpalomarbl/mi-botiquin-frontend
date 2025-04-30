// Angular
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Models
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss'],
})
export class AddMedicineComponent {
  medicine: MedicineDTO;
  reminder: ReminderDTO;
  startDateData: Date;
  startTimeData: string;
  finishDateData: Date;
  finishTimeData: string;
  medicineKitId: number;

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

  constructor(private route: ActivatedRoute) {
    this.medicine = JSON.parse(
      decodeURIComponent(this.route.snapshot.params['medicine'])
    );
    this.medicineKitId = this.route.snapshot.params['medicineKitId'];

    console.log(this.medicine);
    console.log(this.medicineKitId);

    this.reminder = {
      frequency: 0,
      frequencyUnit: '',
      start: new Date(),
      finish: new Date(),
      amount: 0,
      medicineUnit: ''
    }

    this.startDateData = new Date();
    this.startTimeData = '';
    this.finishDateData = new Date();
    this.finishTimeData = '';

    this.expirationDate = new FormControl(this.medicine.expirationDate);
    this.amountMedicine = new FormControl(this.medicine.amount);
    this.unitMedicine = new FormControl(this.medicine.unit);

    this.amountReminder = new FormControl(this.reminder.amount);
    this.frequency = new FormControl(this.reminder.frequency);
    this.frequencyUnit = new FormControl(this.reminder.frequencyUnit);
    this.startDate = new FormControl(this.startDateData);
    this.startTime = new FormControl(this.startTimeData);
    this.finishDate = new FormControl(this.finishDateData);
    this.finishTime = new FormControl(this.finishTimeData);

    this.medicineForm = new FormGroup({
      expirationDate: this.expirationDate,
      amountMedicine: this.amountMedicine,
      unitMedicine: this.unitMedicine
    });

    this.reminderForm = new FormGroup({
      amountReminder: this.amountReminder,
      frequency: this.frequency,
      frequencyUnit: this.frequencyUnit,
      startDate: this.startDate,
      startTime: this.startTime,
      finishDate: this.finishDate,
      finishTime: this.finishTime
    });
  }
}
