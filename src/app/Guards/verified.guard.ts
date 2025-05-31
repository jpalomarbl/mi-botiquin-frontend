import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { GlobalStateDTO } from '../Models/globalState.dto';
import { DialogService } from '../Services/dialog.service';
import { selectUserVerified } from '../Store/auth/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class VerifiedGuard implements CanActivate {
  constructor(
    private store: Store<GlobalStateDTO>,
    private router: Router,
    private dialogService: DialogService,
    public dialog: MatDialog
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectUserVerified).pipe(
      take(1),
      map((isVerified) => {
        if (isVerified) {
          return true;
        } else {
          this.dialogService.openErrorDialog(
            'Para utilizar las funcionalidades de la aplicación, debes haber verificado tu email. Por favor, verifica tu correo electrónico y vuelve a intentarlo.',
            this.dialog
          );
          
          return this.router.createUrlTree(['/']);
        }
      })
    );
  }
}
