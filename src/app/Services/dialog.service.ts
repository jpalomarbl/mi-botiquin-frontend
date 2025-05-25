import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Action } from '@ngrx/store';

import { ConfirmationDialogComponent } from '../Components/Common/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../Components/Common/error-dialog/error-dialog.component';
import { medicineConsumptionDialogComponent } from '../Components/Common/medicine-consumption-dialog/medicine-consumption-dialog.component';
import { SuccessDialogComponent } from '../Components/Common/success-dialog/success-dialog.component';

import { ReminderDTO } from '../Models/reminder.dto';

interface ConfirmationDialogConfig {
  title: string;
  message: string;
  route: string;
  action?: Action;
  actionArgs?: any;
}

interface MedicineConsumptionDialogConfig {
  reminder: ReminderDTO;
  time: Date;
  status: boolean;
  increase: boolean;
  halfConsumption?: boolean;
  consumed: boolean;
}

interface SuccessDialogConfig {
  title: string;
  message: string;
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

  openConfirmationDialog(
    config: ConfirmationDialogConfig,
    confirmationDialog: MatDialog
  ): void {
    confirmationDialog.open(ConfirmationDialogComponent, {
      data: config,
    });
  }

  openMedicineConsumptionDialog(
    config: MedicineConsumptionDialogConfig,
    medicineConsumptionDialog: MatDialog
  ): void {
    medicineConsumptionDialog.open(medicineConsumptionDialogComponent, {
      data: config,
    });
  }

  openSuccessDialog(
    config: SuccessDialogConfig,
    successDialog: MatDialog
  ): void {
    successDialog.open(SuccessDialogComponent, {
      data: config,
    });
  }
}
