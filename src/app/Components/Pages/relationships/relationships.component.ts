// Angular
import { Component } from '@angular/core';

// RxJS
import { Observable } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import { sendRelationshipRequest } from 'src/app/Store/auth/actions/notification.actions';
import * as userRelationshipsActions from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';

// Components
import { FooterComponent } from '../../Common/footer/footer.component';

// Services
import { DialogService } from 'src/app/Services/dialog.service';

// Pipes
import { CensorEmailPipe } from 'src/app/Pipes/censor-email.pipe';

// Custom modules
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AngularMaterialModule } from 'src/app/Modules/angular-material.module';
import { FormsModule } from 'src/app/Modules/forms.module';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { UserDTO } from 'src/app/Models/user.dto';

@Component({
  selector: 'app-relationships',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    AngularMaterialModule,
    CensorEmailPipe,
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
  userId: number;
  userSearchResults: UserDTO[] | null;
  userRelationships: UserDTO[] | null;

  patientSearchString: string;

  patientSearch: FormControl;
  searchForm: FormGroup;

  constructor(
    private store: Store<GlobalStateDTO>,
    private dialogService: DialogService,
    public dialog: MatDialog
  ) {
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
    this.userId = 0;

    this.patientSearch = new FormControl(
      this.patientSearchString,
      Validators.required
    );
    this.searchForm = new FormGroup({
      patientSearch: this.patientSearch,
    });
  }

  ngOnInit(): void {
    this.user$.subscribe((user: UserDTO | null) => {
      if (user) {
        this.userRole = user.role;
        this.userId = user.id;

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

  sendRelationshipRequest(
    userId: number,
    firstName: string,
    email: string,
    lastName?: string
  ): void {
    const censorEmailPipe = new CensorEmailPipe();
    const censoredEmail = censorEmailPipe.transform(email);

    this.dialogService.openConfirmationDialog(
      {
        title: '¿Enviar solicitud a ' + firstName + '?',
        message:
          '¿Estás seguro de que deseas enviar una solicitud de relación a ' +
          firstName +
          ' ' +
          (lastName ? lastName : '') +
          ' (' + censoredEmail + ')?',
        route: '/',
        action: sendRelationshipRequest({
          requesterId: this.userId,
          receiverId: userId,
        }),
      },
      this.dialog
    );

    console.log("requesterId: ", this.userId);
    console.log("receiverId: ", userId);
  }
}
