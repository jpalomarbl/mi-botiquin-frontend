// Angular
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Angular Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [AngularMaterialModule],

  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  title: string;
  message: string;

  constructor(private router: Router, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.message = data.message;
  }

  navigate(): void {
    if (
      this.data.route === '/' ||
      this.data.route === 'remindersList' ||
      this.data.route === 'medicineKitsList' ||
      this.data.route === 'userConfig'
    ) {
      this.router.navigate([this.data.route]);
    }
  }
}
