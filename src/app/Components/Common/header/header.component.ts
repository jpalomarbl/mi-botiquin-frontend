import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';

import { Store } from '@ngrx/store';
import { fetchUserUnreadNotifications } from 'src/app/Store/auth/actions/notification.actions';
import {
  selectUser,
  selectUserNotifications,
} from 'src/app/Store/auth/selectors/auth.selectors';

import { WebSocketService } from 'src/app/Services/web-socket.service';

import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';

import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { NotificationDTO } from 'src/app/Models/notification.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'custom-header',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() hasBackButton: boolean = true;
  @Input() backButtonDirection: string = 'back';

  @Input() title: string = 'Mi Botiquín';

  notifications: NotificationDTO[];
  notifications$: Observable<NotificationDTO[] | null>;
  user$: Observable<UserDTO | null>;

  constructor(
    private router: Router,
    private store: Store<GlobalStateDTO>,
    public webSocketService: WebSocketService
  ) {
    this.notifications = [];
    this.notifications$ = this.store.select(selectUserNotifications);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.webSocketService.notifications$
    .pipe(take(1))
    .subscribe((notifications) => {
      this.notifications = [...this.notifications, ...notifications];
      console.log('Notificaciones actualizadas:', notifications);
    });

    this.user$
    .pipe(take(1))
    .subscribe((user: UserDTO | null) => {
      if (user) {
        this.store.dispatch(fetchUserUnreadNotifications({ userId: user.id }));
      }

      this.notifications$
      .subscribe(
        (notifications: NotificationDTO[] | null) => {
          this.notifications = [
            ...this.notifications,
            ...(notifications || []),
          ];
          console.log('Notificaciones actualizadas:', notifications);
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
}
