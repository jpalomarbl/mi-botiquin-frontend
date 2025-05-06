// Angular
import { Component, Inject } from '@angular/core';

// Angular Material
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public errorMsg: any) {
    this.errorMessage = errorMsg.errorMsg;
  }

  ngOnInit(): void {
    console.log(this.errorMessage)
  }

}
