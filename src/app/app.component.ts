import { Component } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { GlobalStateDTO } from './Models/globalState.dto';
import { UserDTO } from './Models/user.dto';
import { WebSocketService } from './Services/web-socket.service';
import * as AuthActions from './Store/auth/actions/auth.actions';
import { fetchUserUnreadNotifications } from './Store/auth/actions/notification.actions';
import { selectUser } from './Store/auth/selectors/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend-project';

  user$: Observable<UserDTO | null>;

  constructor(
    private store: Store<GlobalStateDTO>,
    private webSocketService: WebSocketService,
    private actions$: Actions
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkSession());

    this.actions$
      .pipe(ofType(AuthActions.checkSessionSuccess))
      .subscribe(() => {
        this.webSocketService.openConnection();
      });

    this.user$.pipe(take(1)).subscribe((user: UserDTO | null) => {
      this.store.dispatch(fetchUserUnreadNotifications({ userId: user!.id }));
    });
  }
}
