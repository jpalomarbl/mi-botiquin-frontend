// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, take } from 'rxjs';

// Env
import { environment } from '../environment/environment';

// Store
import { Store } from '@ngrx/store';
import * as notificationActions from '../Store/auth/actions/notification.actions';
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

  constructor(
    private authService: AuthService,
    private store: Store<GlobalStateDTO>
  ) {
    this.socket$ = null;

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

                console.log(rawMessage);

                let message: any = rawMessage;

                if (rawMessage.type === 'expired') {
                  message = {
                    type: rawMessage.type,
                    id1: rawMessage.medicineId,
                    medicineName: rawMessage.medicineName,
                    id2: rawMessage.medicineKitId,
                    medicineKitName: rawMessage.medicineKitName,
                    medicineKitId: rawMessage.medicineKitId
                  };

                  // console.log(message)

                  this.store.dispatch(
                    notificationActions.addNotification({
                      notification: message,
                    })
                  );
                } else if (rawMessage.type === 'relationship request') {
                  message = {
                    type: rawMessage.type,
                    id1: rawMessage.id1,
                    id2: rawMessage.id2,
                    requesterFirstName: rawMessage.requesterFirstName,
                    requesterLastName: rawMessage.requesterLastName,
                    requesterEmail: rawMessage.requesterEmail,
                    requesterRole: rawMessage.requesterRole,
                  };

                  this.store.dispatch(
                    notificationActions.addNotification({
                      notification: message,
                    })
                  );
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
