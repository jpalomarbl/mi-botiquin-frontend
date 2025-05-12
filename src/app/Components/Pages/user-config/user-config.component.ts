// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Modules
import { passwordsMatch } from 'src/app/Directives/passwordsMatch.validator';
import { FormsModule } from 'src/app/Modules/forms.module';

// Store
import { Store } from '@ngrx/store';
import { updateUser } from 'src/app/Store/auth/actions/auth.actions';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [FormsModule, HeaderComponent, FooterComponent],
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

  constructor(private store: Store<GlobalStateDTO>) {
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
    this.password = new FormControl(this.passwordString, [
      passwordsMatch(this.confirmPassword),
    ]);

    this.userForm = new FormGroup({
      password: this.password,
      confirmPassword: this.confirmPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    });
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
  }

  submitUserConfig(): void {
    const userData: UserDTO = {
      ...this.user,
    };

    userData.firstName = this.firstName.value;
    userData.lastName = this.lastName.value;
    userData.role = this.role.value;
    this.passwordString = this.password.value;

    this.store.dispatch(
      updateUser({
        user: userData,
        password: this.passwordString,
      })
    );
  }
}
