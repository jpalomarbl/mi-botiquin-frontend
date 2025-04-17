import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from 'src/app/environment/environment';
import { LoginDTO } from 'src/app/Models/auth.dto';
import { FormsModule } from 'src/app/Modules/forms/forms.module';
import { login, loginOAuth } from 'src/app/Store/auth/actions/auth.actions';
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
