// Angular
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// Rxjs
import { filter, Observable, Subject, take } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
  fetchUserUnreadNotifications,
  removeNotification,
} from 'src/app/Store/auth/actions/notification.actions';
import { acceptRelationshipRequest } from 'src/app/Store/auth/actions/userRelationships.actions';
import {
  selectUser,
  selectUserNotifications,
} from 'src/app/Store/auth/selectors/auth.selectors';

// Services
import { DialogService } from 'src/app/Services/dialog.service';
import { MedicineKitService } from 'src/app/Services/medicineKit.service';
import { WebSocketService } from 'src/app/Services/web-socket.service';

// Pipes
import { CensorEmailPipe } from 'src/app/Pipes/censor-email.pipe';

// Modules
import { MatDialog } from '@angular/material/dialog';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineDTO } from 'src/app/Models/medicine.dto';
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
  hasBackButton: boolean = true;

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
    private medicineKitService: MedicineKitService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.notifications = [];
    this.notifications$ = this.store.select(selectUserNotifications);
    this.user$ = this.store.select(selectUser);
    this.notificationsButtonDisable = false;
  }

  ngOnInit(): void {
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
          if (notifications) {
            this.notifications = notifications;
          }
        }
      );
    });

    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const route =
          this.route.snapshot.firstChild?.routeConfig?.path?.split('/')[0];

        switch (route) {
          case 'login':
            this.hasBackButton = false;
            break;

          case 'register':
            this.hasBackButton = false;
            break;

          default:
            this.hasBackButton = true;
            break;
        }
      });
  }

  clickExpirationNotification(notification: expirationNotificationDTO): void {
    console.log(notification);

    this.medicineKitService
      .fetchMedicineById(notification.id1)
      .subscribe((medicine) => {
        console.log(medicine);

        const medicineItem: MedicineDTO = {
          id: medicine.id,
          name: medicine.name,
          reminder: medicine.reminder,
          unit: medicine.unit,
          amount: medicine.amount,
          expirationDate: medicine.expirationDate,
          nregistro: medicine.nregistro,
          dose: medicine.dose,
        };

        const medicineJSON = encodeURIComponent(JSON.stringify(medicineItem));

        this.dialogService.openConfirmationDialog(
          {
            title: '¿Ir a los detalles del medicamento?',
            message:
              '¿Quieres ver los detalles del medicamento ' +
              medicine.name +
              ' ?',
            route:
              'addMedicine/update/' +
              medicine.medicineKitId +
              '/' +
              medicineJSON,
            action: removeNotification({ notification: notification }),
          },
          this.dialog
        );
      });
  }

  backButtonRedirect() {
    const route =
      this.route.snapshot.firstChild?.routeConfig?.path?.split('/')[0];

    switch (route) {
      case 'remindersList':
        history.back();
        break;

      case 'medicineKitsList':
        history.back();
        break;

      case 'medicineKitDetails':
        this.router.navigate(['medicineKitsList']);
        break;

      case 'addMedicineKit':
        this.router.navigate(['medicineKitsList']);
        break;

      case 'searchMedicine':
        history.back();
        break;

      case 'addMedicine':
        history.back();
        break;

      case 'userConfig':
        history.back();
        break;

      case 'relationships':
        this.router.navigate(['']);
        break;

      default:
        this.router.navigate(['']);
        break;
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
