// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { environment } from 'src/app/environment/environment';

// Store
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { login, loginError, loginOAuth } from 'src/app/Store/auth/actions/auth.actions';

// Rxjs
import { Observable, take } from 'rxjs';
import { ofType } from '@ngrx/effects';

// Models
import { LoginDTO } from 'src/app/Models/auth.dto';

// Custom modules
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { FormsModule } from 'src/app/Modules/forms.module';

// Services
import { WebSocketService } from 'src/app/Services/web-socket.service';
import { ErrorService } from 'src/app/Services/error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, AngularMaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials: LoginDTO;

  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  // loading$: Observable<boolean>;
  // error$: Observable<string | null>;

  constructor(private store: Store, private router: Router, private webSocketService: WebSocketService, private actions$: Actions, private errorService: ErrorService, public errorDialog: MatDialog) {
    this.credentials = {
      email: '',
      password: '',
    };

    this.email = new FormControl(this.credentials.email);
    this.password = new FormControl(this.credentials.password);
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });

    // this.loading$ = this.store.select(selectAuthLoading);
    // this.error$ = this.store.select(selectors.selectAuthError);
  }

  ngOnInit(): void {
    this.webSocketService.closeSocket();

    this.actions$.pipe(ofType(loginError)).subscribe((error) => {
          this.errorService.openErrorDialog(error.error, this.errorDialog);
        });
  }

  submitLogin(): void {
    this.credentials = {
      email: this.email.value,
      password: this.password.value,
    };

    this.store.dispatch(login({ credentials: this.credentials }));
  }

  submitLoginGoogle(): void {
    this.store.dispatch(loginOAuth());

    window.location.href = environment.api_url + '/auth/google';
  }
}
