import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { take } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { RegisterDTO } from 'src/app/Models/auth.dto';
import { FormsModule } from 'src/app/Modules/forms.module';
import { DialogService } from 'src/app/Services/dialog.service';
import { loginOAuth, register, registerError, registerSuccess } from 'src/app/Store/auth/actions/auth.actions';

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

  constructor(
    private store: Store,
    private dialogService: DialogService,
    private actions$: Actions,
    public dialog: MatDialog
  ) {
    this.userData = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: '',
    };

    this.email = new FormControl(this.userData.email, [Validators.required, Validators.email]);
    this.password = new FormControl(this.userData.password, Validators.required);
    this.firstName = new FormControl(this.userData.firstName, Validators.required);
    this.lastName = new FormControl(this.userData.lastName);
    this.role = new FormControl(this.userData.role, Validators.required);
    this.registerForm = new FormGroup({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    });
  }

  ngOnInit(): void {
    // Error dialog handling
    this.actions$
      .pipe(
        ofType(
          registerError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });

    // Success dialog handling
    this.actions$
      .pipe(ofType(registerSuccess), take(1))
      .subscribe(() => {
        this.dialogService.openSuccessDialog(
          {
            title: 'Registro completado',
            message: 'Te has registrado correctamente.',
          },
          this.dialog
        );
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

    this.dialogService.openConfirmationDialog(
      {
        title: 'Consentimiento informado',
        message:
          'Al registrarte en "Mi Botiquín", consientes explícitamente el tratamiento de tus datos personales. Estos datos se usarán exclusivamente para gestionar tu cuenta, ofrecer las funcionalidades de la aplicación, como la gestión de botiquines y recordatorios de medicamentos, y mejorar tu experiencia de usuario.',
        action: register({ userData: this.userData }),
        route: '',
      },
      this.dialog
    );
  }

  submitRegisterGoogle(): void {
    this.store.dispatch(loginOAuth());

    window.location.href = environment.api_url + '/auth/google';
  }
}
