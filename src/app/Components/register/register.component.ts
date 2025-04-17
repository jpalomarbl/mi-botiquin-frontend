import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { FormsModule } from 'src/app/Modules/forms/forms.module';
import { loginOAuth, register } from 'src/app/Store/auth/actions/auth.actions';
import { RegisterDTO } from 'src/app/Store/auth/models/auth.dto';
import { environment } from 'src/app/environment/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userData: RegisterDTO;

  email: FormControl;
  password: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  role: FormControl;
  registerForm: FormGroup;

  // loading$: Observable<boolean>;
  // error$: Observable<string | null>;

  constructor(private store: Store, private router: Router) {
    this.userData = {
      email: 'patient4@mail.com',
      password: 'password1234',
      firstName: 'John',
      lastName: 'Doe',
      role: 'patient',
    };

    this.email = new FormControl(this.userData.email);
    this.password = new FormControl(this.userData.password);
    this.firstName = new FormControl(this.userData.firstName);
    this.lastName = new FormControl(this.userData.lastName);
    this.role = new FormControl(this.userData.role);
    this.registerForm = new FormGroup({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    });

    // this.loading$ = this.store.select(selectors.selectAuthLoading);
    // this.error$ = this.store.select(selectors.selectAuthError);
  }

  submitRegister(): void {
    this.userData = {
      email: this.email.value,
      password: this.password.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      role: this.role.value,
    };

    this.store.dispatch(register({ userData: this.userData }));
  }

  submitRegisterGoogle(): void {
    this.store.dispatch(loginOAuth());

    window.location.href = environment.api_url + '/auth/google';
  }
}
