// Angular
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

// Modules
import { FormsModule } from 'src/app/Modules/forms.module';

// Store
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';

// Models
import { UserDTO } from 'src/app/Models/user.dto';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent {
  user: UserDTO;

  firstName: FormControl;
  lastName: FormControl;
  email: FormControl;
  password: FormControl;
  role: FormControl;
  userForm: FormGroup;

  passwordString: string;
  originalRole: string;

  constructor(private store: Store<GlobalStateDTO>) {
    this.user = {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
      role: ''
    };

    this.passwordString = '';
    this.originalRole = '';

    this.firstName = new FormControl(this.user.firstName);
    this.lastName = new FormControl(this.user.lastName);
    this.role = new FormControl(this.user.role);
    this.email = new FormControl(this.user.email);
    this.password = new FormControl(this.passwordString);
    this.userForm = new FormGroup({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
    });
  }

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user: UserDTO | null) => {
      if (user) {
        this.user = user;
        this.originalRole = user.role;

        this.firstName.setValue(user.firstName);
        this.lastName.setValue(user.lastName);
        this.email.setValue(user.email);
        this.role.setValue(user.role);
      }
    });
  }

  submitUserConfig(): void {
    this.user.email = this.email.value;
    this.user.firstName = this.firstName.value;
    this.user.lastName = this.lastName.value;
    this.user.role = this.role.value;
    this.passwordString = this.password.value;


    // Handle form submission logic here
  }
}
