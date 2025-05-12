import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../Components/Common/error-dialog/error-dialog.component';
import { ConfirmationDialogComponent } from '../Components/Common/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() { }

  openErrorDialog(errorMsg: string, errorDialog: MatDialog): void {
      errorDialog.open(ErrorDialogComponent, {
        data: {
          errorMsg: errorMsg,
        },
      });
    }
}
