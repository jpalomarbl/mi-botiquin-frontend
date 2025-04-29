import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Custom modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Models
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';

// Components
import { HeaderComponent } from '../../Common/header/header.component';
import { FooterComponent } from '../../Common/footer/footer.component';

@Component({
  selector: 'app-add-medicine-kit',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './add-medicine-kit.component.html',
  styleUrls: ['./add-medicine-kit.component.scss'],
})
export class AddMedicineKitComponent {
  medicineKitName: FormControl;
  medicineKitNote: FormControl;
  ownerId: FormControl;

  medicineKitForm: FormGroup;

  medicineKit: MedicineKitDTO;

  constructor() {
    this.medicineKit = {
      id: 0,
      owner: {
        id: 0,
        role: '',
        email: '',
        firstName: '',
        lastName: '',
      },
      name: '',
      note: '',
      medicines: [],
    };

    this.medicineKitName = new FormControl(this.medicineKit.name);
    this.medicineKitNote = new FormControl(this.medicineKit.note);
    this.ownerId = new FormControl(this.medicineKit.owner.id);

    this.medicineKitForm = new FormGroup({
      medicineKitName: this.medicineKitName,
      medicineKitNote: this.medicineKitNote,
      ownerId: this.ownerId
    });
  }

  submitMedicineKit(): void {
    this.medicineKit.name = this.medicineKitName.value;
    this.medicineKit.note = this.medicineKitNote.value;


    console.log(this.medicineKit);
  }
}
