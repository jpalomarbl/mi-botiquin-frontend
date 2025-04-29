import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Components
import { HeaderComponent } from '../../Common/header/header.component';
import { FooterComponent } from '../../Common/footer/footer.component';

@Component({
  selector: 'app-search-medicine',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './search-medicine.component.html',
  styleUrls: ['./search-medicine.component.scss']
})
export class SearchMedicineComponent {
  medicine: FormControl;
  medicineForm: FormGroup;

  medicineName: string;

  constructor() {
    this.medicineName = '';

    this.medicine = new FormControl(this.medicineName, Validators.required);

    this.medicineForm = new FormGroup({
      medicine: this.medicine
    });
  }
}
