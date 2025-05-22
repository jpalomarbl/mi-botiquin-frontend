// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Modules
import { MatDialog } from '@angular/material/dialog';
import { passwordsMatch } from 'src/app/Directives/passwordsMatch.validator';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { FormsModule } from 'src/app/Modules/forms.module';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import * as authActions from 'src/app/Store/auth/actions/auth.actions';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';

// Services
import { DialogService } from 'src/app/Services/dialog.service';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss'],
})
export class UserConfigComponent {
  user: UserDTO;

  firstName: FormControl;
  lastName: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  role: FormControl;
  userForm: FormGroup;

  passwordString: string;
  confirmPasswordString: string;
  originalRole: string;

  constructor(
    private store: Store<GlobalStateDTO>,
    private dialogService: DialogService,
    private actions$: Actions,
    public dialog: MatDialog
  ) {
    this.user = {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
      role: '',
    };

    this.passwordString = '';
    this.confirmPasswordString = '';
    this.originalRole = '';

    this.firstName = new FormControl(this.user.firstName, [
      Validators.required,
    ]);
    this.lastName = new FormControl(this.user.lastName);
    this.role = new FormControl(this.user.role, [Validators.required]);
    this.confirmPassword = new FormControl(this.confirmPasswordString);
    this.password = new FormControl(this.passwordString);

    this.userForm = new FormGroup(
      {
        password: this.password,
        confirmPassword: this.confirmPassword,
        firstName: this.firstName,
        lastName: this.lastName,
        role: this.role,
      },
      { validators: passwordsMatch('password', 'confirmPassword') }
    );
  }

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user: UserDTO | null) => {
      if (user) {
        this.user = user;
        this.originalRole = user.role;

        this.firstName.setValue(user.firstName);
        this.lastName.setValue(user.lastName);
        this.role.setValue(user.role);
      }
    });

    this.actions$
      .pipe(ofType(authActions.updateUserError), take(1))
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });
  }

  submitUserConfig(): void {
    const userData: UserDTO = {
      ...this.user,
    };

    userData.firstName = this.firstName.value;
    userData.lastName = this.lastName.value;
    userData.role = this.role.value;
    this.passwordString = this.password.value;

    this.dialogService.openConfirmationDialog(
      {
        title: '¿Estás seguro de que deseas editar tus datos?',
        message:
          'Ten en cuenta que si cambias tu rol de "familiar" a cualquier otro, perderás cualquier relación previamente establecida con otro usuario.',
        route: '/',
        action: authActions.updateUser({
          user: userData,
          password: this.passwordString,
        }),
      },
      this.dialog
    );
  }

  logout(): void {
    this.dialogService.openConfirmationDialog(
      {
        title: '¿Estás seguro de que deseas cerrar sesión?',
        message:
          'Deberás volver a iniciar sesión para acceder a la aplicación.',
        route: 'login',
        action: authActions.logout(),
      },
      this.dialog
    );
  }
}
