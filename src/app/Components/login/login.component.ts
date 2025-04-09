import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormsModule } from '../../Modules/forms/forms.module';

import { login } from '../../auth/actions/auth.actions';
import { LoginDTO } from '../../auth/models/auth.dto';
import * as selectors from '../../auth/selectors/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  cretentials: LoginDTO;

  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.cretentials = { email: '', password: '' };

    this.loading$ = this.store.select(selectors.selectAuthLoading);
    this.error$ = this.store.select(selectors.selectAuthError);
  }

  login(): void {
    this.store.dispatch(login({ credentials: this.cretentials }));
  }
}
