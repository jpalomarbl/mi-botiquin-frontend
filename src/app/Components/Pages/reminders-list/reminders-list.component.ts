import { Component } from '@angular/core';

import { HeaderComponent } from '../../Common/header/header.component';
import { FooterComponent } from '../../Common/footer/footer.component';

@Component({
  selector: 'app-reminders-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.scss']
})
export class RemindersListComponent {

}
