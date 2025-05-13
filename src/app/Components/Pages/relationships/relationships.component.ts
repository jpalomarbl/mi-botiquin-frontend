// Angular
import { Component } from '@angular/core';

// RxJS
import { Observable } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import * as userRelationshipsActions from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';
import { HeaderComponent } from '../../Common/header/header.component';

// Custom modules
import { FormControl, FormGroup } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { FormsModule } from 'src/app/Modules/forms.module';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-relationships',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    AngularMaterialModule,
  ],
  templateUrl: './relationships.component.html',
  styleUrls: ['./relationships.component.scss'],
})
export class RelationshipsComponent {
  userRelationships$: Observable<UserDTO[] | null>;
  user$: Observable<UserDTO | null>;
  userSearchResults$: Observable<UserDTO[] | null>;
  loading$: Observable<boolean | null>;

  userRole: string;
  userSearchResults: UserDTO[] | null;
  userRelationships: UserDTO[] | null;

  patientSearchString: string;

  patientSearch: FormControl;
  searchForm: FormGroup;

  constructor(private store: Store<GlobalStateDTO>) {
    this.userRelationships$ = this.store.select(
      authSelectors.selectUserRelationships
    );
    this.userSearchResults$ = this.store.select(
      authSelectors.selectUserSearchResults
    );
    this.user$ = this.store.select(authSelectors.selectUser);

    this.loading$ = this.store.select(authSelectors.selectAuthLoading);

    this.userRelationships = [];
    this.userSearchResults = [];

    this.patientSearchString = '';
    this.userRole = '';

    this.patientSearch = new FormControl(this.patientSearchString);
    this.searchForm = new FormGroup({
      patientSearch: this.patientSearch,
    });
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

        this.userRelationships$.subscribe((relationships) => {
          console.log('User relationships:', relationships);
          this.userRelationships = relationships;
        });

        // this.store.dispatch(notificationActions.sendRelationshipRequest({
        //   requesterId: user.id,
        //   receiverId: 8
        // }));
      }
    });
  }

  searchUsers(): void {
    this.store.dispatch(
      userRelationshipsActions.searchUsers({
        searchTerm: this.patientSearch.value,
      })
    );

    this.userSearchResults$.subscribe((results) => {
      console.log('Search results:', results);

      this.userSearchResults = results;
    });
  }
}
