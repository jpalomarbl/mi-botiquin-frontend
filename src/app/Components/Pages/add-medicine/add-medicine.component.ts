// Angular
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Components
import { MedicineDTO } from 'src/app/Models/medicine.dto';
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss'],
})
export class AddMedicineComponent {
  medicine: MedicineDTO;
  medicineKitId: number;

  constructor(private route: ActivatedRoute) {
    this.medicine = JSON.parse(
      decodeURIComponent(this.route.snapshot.params['medicine'])
    );
    this.medicineKitId = this.route.snapshot.params['medicineKitId'];

    console.log(this.medicine);
    console.log(this.medicineKitId);
  }
}
