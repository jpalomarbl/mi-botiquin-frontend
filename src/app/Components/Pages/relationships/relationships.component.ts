// Angular
import { Component } from '@angular/core';

// RxJS
import { Observable } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
  selectUser,
  selectUserRelationships,
} from 'src/app/Store/auth/selectors/auth.selectors';
import * as userRelationshipsActions from 'src/app/Store/auth/actions/userRelationships.actions';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';
@Component({
  selector: 'app-relationships',
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.scss'],
})
export class RelationshipsComponent {
  userRelationships$: Observable<UserDTO[] | null>;
  user$: Observable<UserDTO | null>;

  userRole: string;

  constructor(private store: Store<GlobalStateDTO>) {
    this.userRole = '';
    this.userRelationships$ = this.store.select(selectUserRelationships);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    // this.store.dispatch(userRelationshipsActions.searchUsers({ searchTerm: 'test' }));

    this.user$.subscribe((user: UserDTO | null) => {
      if (user) {
        this.userRole = user.role;

        if (user.role === 'caretaker') {
          this.store.dispatch(
            userRelationshipsActions.fetchCaretakerRelationships({
              userId: user.id,
            })
          );
        } else if (user.role === 'family member') {
          this.store.dispatch(
            userRelationshipsActions.fetchFamilyMemberRelationships({
              userId: user.id,
            })
          );
        } else {
          this.store.dispatch(
            userRelationshipsActions.fetchPatientRelationships({
              userId: user.id,
            })
          );
        }
      }
    });
  }
}
