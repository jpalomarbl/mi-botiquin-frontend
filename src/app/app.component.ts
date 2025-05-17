import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './Store/auth/actions/auth.actions';
import { HeaderComponent } from './Components/Common/header/header.component';
import { FooterComponent } from './Components/Common/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend-project';

  constructor(private store: Store) {

  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkSession());
  }

  // sendMessage(message: any) {
  //   this.socket$.next(message);
  // }
}
