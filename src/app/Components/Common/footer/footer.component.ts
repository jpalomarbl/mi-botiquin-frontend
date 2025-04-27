import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'custom-footer',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private router: Router) {}

  navigate(route: string): void {
    if (route === '/' || route === 'remindersList') {
      this.router.navigate([route]);
    }


  }
}
