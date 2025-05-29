// Angular
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Store
import { Store } from '@ngrx/store';
import { changeReminderState } from 'src/app/Store/medicine/actions/reminder.actions';

// Angular Material
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

import { DialogService } from 'src/app/Services/dialog.service';

@Component({
  selector: 'app-medicine-consumption-dialog',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './medicine-consumption-dialog.component.html',
  styleUrls: ['./medicine-consumption-dialog.component.scss'],
})
export class medicineConsumptionDialogComponent {
  increase: boolean;
  reminder: ReminderDTO;
  time: Date;
  status: boolean;
  consumed: boolean;

  constructor(
    private router: Router,
    private store: Store,
    private dialogService: DialogService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.increase = this.data.increase;
    this.reminder = this.data.reminder;
    this.time = this.data.time;
    this.status = this.data.status;
    this.consumed = this.data.consumed;
  }

  fullConsumption(): void {
    if (
      !this.increase &&
      this.reminder.medicineAmount! - this.reminder.amount <= 0
    ) {
      this.dialogService.openErrorDialog(
        'No te quedan unidades de este medicamento. Si aún así deseas marcarlo como consumido, puedes hacer click en la opción "Consumir sin restar unidades"',
        this.dialog
      );

      return;
    }

    this.store.dispatch(
      changeReminderState({
        reminder: this.reminder,
        time: this.time,
        status: this.status,
        increase: this.increase,
      })
    );
  }

  halfConsumption(): void {
    this.store.dispatch(
      changeReminderState({
        reminder: this.reminder,
        time: this.time,
        status: this.status,
        increase: this.increase,
        halfConsumption: true,
      })
    );
  }
}
