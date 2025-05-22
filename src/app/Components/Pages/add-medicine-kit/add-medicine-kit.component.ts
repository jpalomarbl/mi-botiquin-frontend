import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Rxjs
import { ofType } from '@ngrx/effects';
import { Observable, take } from 'rxjs';

// Custom modules
import { MatDialog } from '@angular/material/dialog';

// Models
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { MedicineKitDTO } from 'src/app/Models/medicineKit.dto';
import { UserDTO } from 'src/app/Models/user.dto';

// Store
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DialogService } from 'src/app/Services/dialog.service';
import * as userRelationshipActions from 'src/app/Store/auth/actions/userRelationships.actions';
import * as authSelectors from 'src/app/Store/auth/selectors/auth.selectors';
import * as medicineKitActions from 'src/app/Store/medicine/actions/medicineKit.actions';
import * as medicineSelectors from 'src/app/Store/medicine/selectors/medicine.selectors';

@Component({
  selector: 'app-add-medicine-kit',
  templateUrl: './add-medicine-kit.component.html',
  styleUrls: ['./add-medicine-kit.component.scss'],
})
export class AddMedicineKitComponent {
  user$: Observable<UserDTO | null>;
  userRelationships$: Observable<UserDTO[] | null>;

  loadingAuth$: Observable<boolean>;
  errorAuth$: Observable<string | null>;

  loadingMedicine$: Observable<boolean>;
  errorMedicine$: Observable<string | null>;

  medicineKitName: FormControl;
  medicineKitNote: FormControl;
  ownerId: FormControl;

  medicineKitForm: FormGroup;

  medicineKit: MedicineKitDTO;

  isPatient: boolean;

  userId: number | null;

  constructor(
    private store: Store<GlobalStateDTO>,
    private dialogService: DialogService,
    private actions$: Actions,
    public dialog: MatDialog
  ) {
    this.medicineKit = {
      id: 0,
      owner: {
        id: 0,
        role: '',
        email: '',
        firstName: '',
        lastName: '',
      },
      name: '',
      note: '',
      medicines: [],
    };

    this.medicineKitName = new FormControl(this.medicineKit.name, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]);
    this.medicineKitNote = new FormControl(this.medicineKit.note, [
      Validators.minLength(5),
      Validators.maxLength(150),
    ]);
    this.ownerId = new FormControl(this.medicineKit.owner.id);

    this.medicineKitForm = new FormGroup({
      medicineKitName: this.medicineKitName,
      medicineKitNote: this.medicineKitNote,
      ownerId: this.ownerId,
    });

    this.user$ = this.store.select(authSelectors.selectUser);
    this.userRelationships$ = this.store.select(
      authSelectors.selectUserRelationships
    );

    this.loadingAuth$ = this.store.select(authSelectors.selectAuthLoading);
    this.errorAuth$ = this.store.select(authSelectors.selectAuthError);

    this.loadingMedicine$ = this.store.select(
      medicineSelectors.selectMedicineLoading
    );
    this.errorMedicine$ = this.store.select(
      medicineSelectors.selectMedicineError
    );

    this.isPatient = false;

    this.userId = null;
  }

  ngOnInit(): void {
    // In case of non patient user, loads relationships
    this.user$.subscribe((user: UserDTO | null) => {
      if (user) {
        if (user.role === 'caretaker') {
          this.store.dispatch(
            userRelationshipActions.fetchCaretakerRelationships({
              userId: user.id,
            })
          );
        } else if (user.role === 'family member') {
          this.store.dispatch(
            userRelationshipActions.fetchFamilyMemberRelationships({
              userId: user.id,
            })
          );
        } else this.isPatient = true;

        this.userId = user.id;

        const updatedMedicineKit = {
          ...this.medicineKit,
          owner: {
            ...this.medicineKit.owner,
            id: user.id,
          },
        };

        this.medicineKit = updatedMedicineKit;

        if (!this.isPatient) this.ownerId.addValidators(Validators.required);
      }
    });

    // Error dialog handling
    this.actions$
      .pipe(
        ofType(
          userRelationshipActions.fetchCaretakerRelationshipsError,
          userRelationshipActions.fetchFamilyMemberRelationshipsError,
          medicineKitActions.addMedicineKitError
        ),
        take(1)
      )
      .subscribe((error) => {
        this.dialogService.openErrorDialog(error.error, this.dialog);
      });
  }

  submitMedicineKit(): void {
    const updatedMedicineKit = {
      ...this.medicineKit,
      name: this.medicineKitName.value,
      note: this.medicineKitNote.value,
      owner: {
        ...this.medicineKit.owner,
        id: this.ownerId.value !== 0 ? this.ownerId.value : this.userId,
      },
    };

    this.medicineKit = updatedMedicineKit;

    this.dialogService.openConfirmationDialog(
      {
        title: '¿Crear nuevo botiquín?',
        message: `¿Estás seguro de crear el botiquín ${
          updatedMedicineKit.name
        }${
          +(updatedMedicineKit.note && updatedMedicineKit.note !== '')
            ? ` (${updatedMedicineKit.note})?`
            : '?'
        }`,
        action: medicineKitActions.addMedicineKit({
          medicineKit: this.medicineKit,
        }),
        route: 'medicineKitsList',
      },
      this.dialog
    );
  }
}
