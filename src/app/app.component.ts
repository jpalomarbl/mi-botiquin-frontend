import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './Store/auth/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend-project';

  constructor(private store: Store) {
    this.store.dispatch(AuthActions.checkSession());
  }
}
