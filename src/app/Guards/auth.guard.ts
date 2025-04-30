import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  map,
  Observable,
  of,
  race,
  take,
  tap,
  timeout,
} from 'rxjs';
import {
  checkSession,
  checkSessionError,
  checkSessionSuccess,
} from '../Store/auth/actions/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions
  ) {}

  ngOnInit(): void {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.store.dispatch(checkSession());

    console.log('AUTH');

    return race(
      // Caso exitoso
      this.actions$.pipe(
        ofType(checkSessionSuccess),
        take(1),
        map(() => true)
      ),
      // Caso de error
      this.actions$.pipe(
        ofType(checkSessionError),
        take(1),
        tap(() => this.router.navigate(['/login'])),
        map(() => false)
      )
    ).pipe(
      timeout(5000), // Timeout por si no hay respuesta
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
