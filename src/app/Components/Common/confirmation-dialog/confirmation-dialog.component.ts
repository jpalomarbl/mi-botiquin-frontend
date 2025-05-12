// Angular
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Store
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store';

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
  route: string;
  action: Action | null;
  actionArgs: any[];

  constructor(
    private router: Router,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.message = data.message;
    this.route = data.route;
    this.action = data.action;
    this.actionArgs = data.actionArgs;
  }

  navigate(): void {
    if (
      this.route === '/' ||
      this.route === 'remindersList' ||
      this.route === 'medicineKitsList' ||
      this.route === 'userConfig'
    ) {
      this.router.navigate([this.route]);
    }

    if (this.action) {
      this.store.dispatch(this.action);
    }
  }
}
