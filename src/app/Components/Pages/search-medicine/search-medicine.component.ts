import { Component } from '@angular/core';

// Components
import { HeaderComponent } from '../../Common/header/header.component';
import { FooterComponent } from '../../Common/footer/footer.component';

@Component({
  selector: 'app-search-medicine',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './search-medicine.component.html',
  styleUrls: ['./search-medicine.component.scss']
})
export class SearchMedicineComponent {

}
