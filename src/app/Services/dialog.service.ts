import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Action } from '@ngrx/store';

import { ErrorDialogComponent } from '../Components/Common/error-dialog/error-dialog.component';
import { ConfirmationDialogComponent } from '../Components/Common/confirmation-dialog/confirmation-dialog.component';

interface ConfirmationDialogConfig {
  title: string;
  message: string;
  route: string;
  action?: Action;
  actionArgs?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor() {}

  openErrorDialog(errorMsg: string, errorDialog: MatDialog): void {
    errorDialog.open(ErrorDialogComponent, {
      data: {
        errorMsg: errorMsg,
      },
    });
  }

  openConfirmationDialog(config: ConfirmationDialogConfig, confirmationDialog: MatDialog): void {
    confirmationDialog.open(ConfirmationDialogComponent, {
      data: config,
    });
  }
}
