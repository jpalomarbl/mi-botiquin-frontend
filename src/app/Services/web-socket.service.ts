// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, take } from 'rxjs';

// Env
import { environment } from '../environment/environment';

// Store
import { Store } from '@ngrx/store';
import { selectUser } from '../Store/auth/selectors/auth.selectors';

// Services
import { AuthService } from './auth.service';

// Models
import {
  expirationNotificationDTO,
  NotificationDTO,
  relationshipRequestNotificationDTO,
} from 'src/app/Models/notification.dto';
import { GlobalStateDTO } from '../Models/globalState.dto';
import { UserDTO } from '../Models/user.dto';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocket | null;
  private notificationsSubject: BehaviorSubject<
    Array<expirationNotificationDTO | relationshipRequestNotificationDTO>
  >;

  public notifications$: Observable<
    Array<expirationNotificationDTO | relationshipRequestNotificationDTO>
  >;

  constructor(
    private authService: AuthService,
    private store: Store<GlobalStateDTO>
  ) {
    this.socket$ = null;
    this.notificationsSubject = new BehaviorSubject<
      Array<expirationNotificationDTO | relationshipRequestNotificationDTO>
    >([]);
    this.notifications$ = this.notificationsSubject.asObservable();

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
                const rawMessage = JSON.parse(event.data);
                let message: any;
                if (rawMessage.type === 'expired') {
                  message = {
                    type: rawMessage.type,
                    id1: rawMessage.medicineId,
                    medicineName: rawMessage.medicineName,
                    id2: rawMessage.medicineKitId,
                    medicineKitName: rawMessage.medicineKitName,
                  };
                } else if (rawMessage.type === 'relationship request') {
                  message = {
                    type: rawMessage.type,
                    id1: rawMessage.senderId,
                    id2: rawMessage.receiverId,
                    requesterFirstName: rawMessage.requesterFirstName,
                    requesterLastName: rawMessage.requesterLastName,
                    requesterRole: rawMessage.requesterRole,
                  };
                }

                if (
                  message.type === 'expired' ||
                  message.type === 'relationship request'
                ) {
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

  sendRelationshipRequest(message: NotificationDTO): Observable<boolean> {
    if (this.socket$ && this.socket$.readyState === WebSocket.OPEN) {
      const messageToSend = JSON.stringify(message);
      this.socket$.send(messageToSend);

      return of(true);
    } else {
      console.error('WebSocket is not connected. Cannot send message.');

      return of(false);
    }
  }

  closeSocket(): void {
    this.socket$?.close();
  }
}
