import { Component } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { WebSocketService } from './Services/web-socket.service';
import * as AuthActions from './Store/auth/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend-project';

  constructor(
    private store: Store,
    private webSocketService: WebSocketService,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkSession());

    this.actions$
      .pipe(ofType(AuthActions.checkSessionSuccess))
      .subscribe(() => {
        this.webSocketService.openConnection();
      });
  }
}
