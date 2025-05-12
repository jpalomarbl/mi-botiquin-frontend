// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

import { environment } from 'src/app/environment/environment';

// Store
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  login,
  loginError,
  loginOAuth,
} from 'src/app/Store/auth/actions/auth.actions';
import { selectAuthLoading } from 'src/app/Store/auth/selectors/auth.selectors';

// Rxjs
import { ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';

// Models
import { LoginDTO } from 'src/app/Models/auth.dto';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';

// Custom modules
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { FormsModule } from 'src/app/Modules/forms.module';

// Services
import { ErrorService } from 'src/app/Services/error.service';
import { WebSocketService } from 'src/app/Services/web-socket.service';

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

  loading$: Observable<boolean>;

  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private webSocketService: WebSocketService,
    private actions$: Actions,
    private errorService: ErrorService,
    public errorDialog: MatDialog
  ) {
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

    this.loading$ = this.store.select(selectAuthLoading);
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
