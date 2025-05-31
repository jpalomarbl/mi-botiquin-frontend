// Angular
import { Component } from '@angular/core';

// RxJS
import { Observable, Subject, takeUntil } from 'rxjs';

// Store
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as notificationActions from 'src/app/Store/auth/actions/notification.actions';
import * as userRelationshipsActions from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';

// Services
import { DialogService } from 'src/app/Services/dialog.service';

// Pipes
import { CensorEmailPipe } from 'src/app/Pipes/censor-email.pipe';

// Custom modules
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

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
  userSearchResults$: Observable<UserDTO[] | null>;
  loading$: Observable<boolean | null>;

  userRole: string;
  userId: number;
  userSearchResults: UserDTO[] | null;
  userRelationships: UserDTO[] | null;

  patientSearchString: string;

  patientSearch: FormControl;
  searchForm: FormGroup;

  private destroyed$ = new Subject<void>();

  constructor(
    private store: Store<GlobalStateDTO>,
    private dialogService: DialogService,
    private actions$: Actions,
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
          this.userRelationships = relationships;
        });
      }
    });

    // Error dialong handling
    this.actions$
      .pipe(
        ofType(
          notificationActions.sendRelationshipRequestError,
          userRelationshipsActions.removePatientCaretakerRelationshipError,
          userRelationshipsActions.removePatientFamilyMemberRelationshipError
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });

    // Success dialong handling
    this.actions$
      .pipe(
        ofType(notificationActions.sendRelationshipRequestSuccess),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.dialogService.openSuccessDialog(
          {
            title: 'Solicitud enviada',
            message: 'Se ha enviado la solicitud al usuario.',
          },
          this.dialog
        );
      });

    // Success dialong handling
    this.actions$
      .pipe(
        ofType(
          userRelationshipsActions.removePatientCaretakerRelationshipSuccess,
          userRelationshipsActions.removePatientFamilyMemberRelationshipSuccess
        ),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.dialogService.openSuccessDialog(
          {
            title: 'Relación eliminada',
            message: 'Se ha eliminado la relación con el usuario.',
          },
          this.dialog
        );
      });
  }

  searchUsers(): void {
    this.store.dispatch(
      userRelationshipsActions.searchUsers({
        searchTerm: this.patientSearch.value,
      })
    );

    this.userSearchResults$.subscribe((results) => {
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
          ' (' +
          censoredEmail +
          ')?',
        route: '/',
        action: notificationActions.sendRelationshipRequest({
          requesterId: this.userId,
          receiverId: userId,
        }),
      },
      this.dialog
    );
  }

  removeRelationship(relationship: UserDTO): void {
    const censorEmailPipe = new CensorEmailPipe();
    const censoredEmail = censorEmailPipe.transform(relationship.email);

    if (this.userRole === 'patient') {
      this.dialogService.openConfirmationDialog(
        {
          title: '¿Eliminar relación con ' + relationship.firstName + '?',
          message:
            '¿Estás seguro de que deseas eliminar tu relación con ' +
            relationship.firstName +
            ' ' +
            (relationship.lastName ? relationship.lastName : '') +
            ' (' +
            censoredEmail +
            ')?',
          route: '/',
          action:
            relationship.role === 'caretaker'
              ? userRelationshipsActions.removePatientCaretakerRelationship({
                  patientId: this.userId,
                  caretakerId: relationship.id,
                })
              : userRelationshipsActions.removePatientFamilyMemberRelationship({
                  patientId: this.userId,
                  familyMemberId: relationship.id,
                }),
        },
        this.dialog
      );
    } else if (this.userRole === 'caretaker') {
      this.dialogService.openConfirmationDialog(
        {
          title: '¿Eliminar relación con ' + relationship.firstName + '?',
          message:
            '¿Estás seguro de que deseas eliminar tu relación con ' +
            relationship.firstName +
            ' ' +
            (relationship.lastName ? relationship.lastName : '') +
            ' (' +
            censoredEmail +
            ')?',
          route: '/',
          action: userRelationshipsActions.removePatientCaretakerRelationship({
            patientId: relationship.id,
            caretakerId: this.userId,
          }),
        },
        this.dialog
      );
    } else {
      this.dialogService.openConfirmationDialog(
        {
          title: '¿Eliminar relación con ' + relationship.firstName + '?',
          message:
            '¿Estás seguro de que deseas eliminar tu relación con ' +
            relationship.firstName +
            ' ' +
            (relationship.lastName ? relationship.lastName : '') +
            ' (' +
            censoredEmail +
            ')?',
          route: '/',
          action:
            userRelationshipsActions.removePatientFamilyMemberRelationship({
              patientId: relationship.id,
              familyMemberId: this.userId,
            }),
        },
        this.dialog
      );
    }
  }
}
