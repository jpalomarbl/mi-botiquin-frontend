import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { login } from '../../auth/actions/auth.actions';
import { LoginDTO } from '../../auth/models/auth.dto';
import * as selectors from '../../auth/selectors/auth.selectors';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginDTO;

  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.credentials = { email: '', password: '' };

    this.email = new FormControl(this.credentials.email);
    this.password = new FormControl(this.credentials.password);
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });

    this.loading$ = this.store.select(selectors.selectAuthLoading);
    this.error$ = this.store.select(selectors.selectAuthError);
  }

  submitLogin(): void {
    this.credentials.email = this.email.value;
    this.credentials.password = this.password.value;

    this.store.dispatch(login({ credentials: this.credentials }));

    console.log(
      'User: ',
      this.credentials.email,
      '\nPassword: ',
      this.credentials.password
    );
  }
}
