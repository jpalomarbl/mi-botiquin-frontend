// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';

// Env
import { environment } from '../environment/environment';

// Store
import { Store } from '@ngrx/store';
import { selectUser } from '../Store/auth/selectors/auth.selectors';

// Services
import { AuthService } from './auth.service';

// Models
import { GlobalStateDTO } from '../Models/globalState.dto';
import { NotificationDTO } from '../Models/notification.dto';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocket | null;
  private notificationsSubject: BehaviorSubject<NotificationDTO[]>;

  public notifications$: Observable<NotificationDTO[]>;

  constructor(
    private authService: AuthService,
    private store: Store<GlobalStateDTO>
  ) {
    this.socket$ = null;
    this.notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
    this.notifications$ = this.notificationsSubject.asObservable();;

    this.store
      .select(selectUser)
      .pipe(take(2))
      .subscribe((user: UserDTO | null) => {
        if (user) {
          this.authService
            .getWsJwtToken()
            .pipe(take(1))
            .subscribe((token) => {
              this.socket$ = new WebSocket(
                `${environment.websocket_url}?token=${token}`
              );

              this.socket$!.onmessage = (event) => {
                const message: NotificationDTO = JSON.parse(event.data);

                if (message.type === 'expired') {
                  // Obtenemos el valor actual, añadimos el nuevo mensaje y emitimos
                  const currentNotifications =
                    this.notificationsSubject.getValue();
                  this.notificationsSubject.next([
                    ...currentNotifications,
                    message,
                  ]);
                }
              };

              this.socket$!.onopen = () =>
                console.log('WebSocket connection opened');
              this.socket$!.onclose = () =>
                console.log('WebSocket connection closed');
            });
        }
      });
  }

  closeSocket(): void {
    this.socket$?.close();
  }
}
