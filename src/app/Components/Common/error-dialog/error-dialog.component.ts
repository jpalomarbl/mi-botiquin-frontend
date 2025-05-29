// Angular
import { Component, Inject } from '@angular/core';

// Angular Material
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [AngularMaterialModule],
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public errorMsg: any) {
    this.errorMessage = errorMsg.errorMsg;
  }
}
