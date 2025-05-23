// Angular
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Store
import { Store } from '@ngrx/store';
import { changeReminderState } from 'src/app/Store/medicine/actions/reminder.actions';

// Angular Material
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.increase = this.data.increase;
    this.reminder = this.data.reminder;
    this.time = this.data.time;
    this.status = this.data.status;
    this.consumed = this.data.consumed;
  }

  fullConsumption(): void {
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
        halfConsumption: true
      })
    );
  }
}
