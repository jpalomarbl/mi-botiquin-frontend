// Angular
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

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
  imports: [AngularMaterialModule],
  templateUrl: './medicine-consumption-dialog.component.html',
  styleUrls: ['./medicine-consumption-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  increase: boolean;
  reminder: ReminderDTO;
  time: Date;
  status: boolean;

  constructor(
    private router: Router,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.increase = this.data.increase;
    this.reminder = this.data.reminder;
    this.time = this.data.time;
    this.status = this.data.status;
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
