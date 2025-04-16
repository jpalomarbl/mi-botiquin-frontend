import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { FormsModule } from 'src/app/Modules/forms/forms.module';
import { login, loginOAuth } from '../../auth/actions/auth.actions';
import { LoginDTO } from '../../auth/models/auth.dto';
import * as selectors from '../../auth/selectors/auth.selectors';
import { environment } from 'src/app/environment/environment';
// import { selectAuthLoading } from '../../auth/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
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

  constructor(private store: Store, private router: Router) {
    this.credentials = { email: 'patient4@mail.com', password: 'password1234' };

    this.email = new FormControl(this.credentials.email);
    this.password = new FormControl(this.credentials.password);
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });

    // this.loading$ = this.store.select(selectAuthLoading);
    // this.error$ = this.store.select(selectors.selectAuthError);
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
