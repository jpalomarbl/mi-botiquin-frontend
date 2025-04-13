import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response: any) => {
            localStorage.setItem('user', JSON.stringify(response));
            return AuthActions.loginSuccess({
              user: response,
            });
          }),
          catchError((error) =>
            of(
              AuthActions.loginError({
                error: error.error.error || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response: any) => {
            localStorage.setItem('user', JSON.stringify(response));
            return AuthActions.registerSuccess({
              user: response,
            });
          }),
          catchError((error) =>
            of(
              AuthActions.registerError({
                error: error.error.error || 'Registration failed',
              })
            )
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
            return AuthActions.logoutSuccess();
          }),
          catchError((error) =>
            of(
              AuthActions.logoutError({
                error: error.error.error || 'Logout failed',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  loginOAuthGetUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginOAuthGetUserInfo),
      mergeMap(({ id }) =>
        this.authService.getUserById(id).pipe(
          map((response: any) => {
            localStorage.setItem('user', JSON.stringify(response));
            return AuthActions.loginSuccess({
              user: response,
            });
          }),
          catchError((error) =>
            of(
              AuthActions.loginError({
                error: error.error.error || 'Login failed',
              })
            )
          )
        )
      )
    )
  );
}
