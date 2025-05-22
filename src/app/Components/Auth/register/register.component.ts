import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RegisterDTO } from 'src/app/Models/auth.dto';
import { FormsModule } from 'src/app/Modules/forms.module';
import { loginOAuth, register } from 'src/app/Store/auth/actions/auth.actions';
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


  constructor(private store: Store, private router: Router) {
    this.userData = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
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

    this.router.navigate(['/']);
  }

  submitRegisterGoogle(): void {
    this.store.dispatch(loginOAuth());

    window.location.href = environment.api_url + '/auth/google';
  }
}
