// Angular
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  distinctUntilChanged,
  Observable,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import { fetchUserUnreadNotifications } from 'src/app/Store/auth/actions/notification.actions';
import { acceptRelationshipRequest } from 'src/app/Store/auth/actions/userRelationships.actions';
import {
  selectUser,
  selectUserNotifications,
} from 'src/app/Store/auth/selectors/auth.selectors';

// Services
import { DialogService } from 'src/app/Services/dialog.service';
import { WebSocketService } from 'src/app/Services/web-socket.service';

// Pipes
import { CensorEmailPipe } from 'src/app/Pipes/censor-email.pipe';

// Modules
import { MatDialog } from '@angular/material/dialog';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import {
  expirationNotificationDTO,
  relationshipRequestNotificationDTO,
} from 'src/app/Models/notification.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'custom-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() hasBackButton: boolean = true;
  @Input() backButtonDirection: string = 'back';

  @Input() title: string = 'Mi Botiquín';

  notifications: Array<
    expirationNotificationDTO | relationshipRequestNotificationDTO
  >;
  notifications$: Observable<Array<
    expirationNotificationDTO | relationshipRequestNotificationDTO
  > | null>;
  user$: Observable<UserDTO | null>;
  private destroy$ = new Subject<void>(); // Subject para controlar la desuscripción

  notificationsButtonDisable: boolean;

  constructor(
    private router: Router,
    private store: Store<GlobalStateDTO>,
    public webSocketService: WebSocketService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) {
    this.notifications = [];
    this.notifications$ = this.store.select(selectUserNotifications);
    this.user$ = this.store.select(selectUser);
    this.notificationsButtonDisable = false;
  }

  ngOnInit(): void {
    this.webSocketService.notificationsSubjectGetter
      .pipe(
        distinctUntilChanged(), // Evita valores duplicados
        takeUntil(this.destroy$)
      )
      .subscribe(
        (
          value: expirationNotificationDTO | relationshipRequestNotificationDTO
        ) => {
          if (this.isRelationshipRequest(value)) {
            this.clickRelationshipRequestNotification(value);
          } else {
            this.notifications.push(value);
          }
        }
      );

    this.user$.pipe(take(1)).subscribe((user: UserDTO | null) => {
      if (user) {
        this.store.dispatch(fetchUserUnreadNotifications({ userId: user.id }));
      }

      this.notifications$.subscribe(
        (
          notifications: Array<
            expirationNotificationDTO | relationshipRequestNotificationDTO
          > | null
        ) => {
          this.notifications = [
            ...this.notifications,
            ...(notifications || []),
          ];
          console.log('Notificaciones actualizadas:', notifications);

          if (!notifications) {
            this.notificationsButtonDisable = true;
          }
        }
      );
    });
  }

  backButtonRedirect() {
    if (this.backButtonDirection === 'back') {
      history.back();
    } else {
      this.router.navigate([this.backButtonDirection]);
    }
  }

  clickRelationshipRequestNotification(
    notification: relationshipRequestNotificationDTO
  ): void {
    const censorEmailPipe = new CensorEmailPipe();
    const censoredEmail = censorEmailPipe.transform(
      notification.requesterEmail
    );

    this.dialogService.openConfirmationDialog(
      {
        title: 'Solicitud',
        message: `¿Deseas aceptar la solicitud de amistad de ${
          notification.requesterFirstName +
          (notification.requesterLastName
            ? ' ' + notification.requesterLastName
            : '')
        } (${censoredEmail})?`,
        route: 'relationships',
        action: acceptRelationshipRequest({
          requesterId: notification.id1,
          receiverId: notification.id2,
          requesterRole: notification.requesterRole,
        }),
      },
      this.dialog
    );
  }

  get expirationNotifications(): Array<expirationNotificationDTO> {
    return this.notifications.length > 0
      ? (this.notifications.filter(
          (notification) => notification && notification.type === 'expired'
        ) as Array<expirationNotificationDTO>)
      : [];
  }

  get relationshipRequestNotifications(): Array<relationshipRequestNotificationDTO> {
    return this.notifications.length > 0
      ? (this.notifications.filter(
          (notification) =>
            notification && notification.type === 'relationship request'
        ) as Array<relationshipRequestNotificationDTO>)
      : [];
  }

  // Typeguard
  private isRelationshipRequest(
    value: expirationNotificationDTO | relationshipRequestNotificationDTO
  ): value is relationshipRequestNotificationDTO {
    return 'requesterFirstName' in value; // Verifica una propiedad única de relationshipRequestNotificationDTO
  }
}
