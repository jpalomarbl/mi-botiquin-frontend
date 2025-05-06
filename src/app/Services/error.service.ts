import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../Components/Common/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  openErrorDialog(errorMsg: string, errorDialog: MatDialog): void {
      errorDialog.open(ErrorDialogComponent, {
        data: {
          errorMsg: errorMsg,
        },
      });
    }
}
