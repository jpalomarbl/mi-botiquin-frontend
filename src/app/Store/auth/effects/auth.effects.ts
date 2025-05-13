import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import {
  expirationNotificationDTO,
  relationshipRequestNotificationDTO,
} from 'src/app/Models/notification.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { AuthService } from 'src/app/Services/auth.service';
import { UserRelationshipsService } from 'src/app/Services/user-relationships.service';
import * as AuthActions from '../actions/auth.actions';
import * as notificationActions from '../actions/notification.actions';
import * as userRelationshipActions from '../actions/userRelationships.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private userRelationshipService: UserRelationshipsService
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

  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkSession),
      mergeMap(() =>
        this.authService.checkSession().pipe(
          map((user: UserDTO) => AuthActions.checkSessionSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.checkSessionError({
                error: error.error || 'Session check failed',
              })
            )
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      mergeMap(({ user, password }) =>
        this.authService.updateUser(user, password).pipe(
          map((user: UserDTO) => AuthActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(
              AuthActions.checkSessionError({
                error: error.error || 'Session check failed',
              })
            )
          )
        )
      )
    )
  );

  fetchPatientRelationships$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.fetchPatientRelationships),
      mergeMap(({ userId }) =>
        this.userRelationshipService.fetchPatientRelationships(userId).pipe(
          map((response: UserDTO[]) => {
            return userRelationshipActions.fetchPatientRelationshipsSuccess({
              relationships: response,
            });
          }),
          catchError((error) =>
            of(
              userRelationshipActions.fetchPatientRelationshipsError({
                error: error.error || 'Fetch relationships failed',
              })
            )
          )
        )
      )
    )
  );

  fetchCaretakerRelationships$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.fetchCaretakerRelationships),
      mergeMap(({ userId }) =>
        this.userRelationshipService.fetchCaretakerRelationships(userId).pipe(
          map((response: UserDTO[]) => {
            return userRelationshipActions.fetchCaretakerRelationshipsSuccess({
              relationships: response,
            });
          }),
          catchError((error) =>
            of(
              userRelationshipActions.fetchCaretakerRelationshipsError({
                error: error.error || 'Fetch relationships failed',
              })
            )
          )
        )
      )
    )
  );

  fetchFamilyMemberRelationships$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.fetchFamilyMemberRelationships),
      mergeMap(({ userId }) =>
        this.userRelationshipService
          .fetchFamilyMemberRelationships(userId)
          .pipe(
            map((response: UserDTO[]) => {
              return userRelationshipActions.fetchFamilyMemberRelationshipsSuccess(
                {
                  relationships: response,
                }
              );
            }),
            catchError((error) =>
              of(
                userRelationshipActions.fetchFamilyMemberRelationshipsError({
                  error: error.error || 'Fetch relationships failed',
                })
              )
            )
          )
      )
    )
  );

  fetchCaretakerRelationshipsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          userRelationshipActions.fetchCaretakerRelationshipsSuccess,
          userRelationshipActions.fetchFamilyMemberRelationshipsSuccess
        )
      ),
    { dispatch: false }
  );

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.searchUsers),
      mergeMap(({ searchTerm }) =>
        this.userRelationshipService.searchUsers(searchTerm).pipe(
          map((response: UserDTO[]) => {
            console.log('searchUsers response', response);

            return userRelationshipActions.searchUsersSuccess({
              searchResults: response,
            });
          }),
          catchError((error) =>
            of(
              userRelationshipActions.searchUsersError({
                error: error.error || 'Fetch relationships failed',
              })
            )
          )
        )
      )
    )
  );

  fetcUsersUnreadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.fetchUserUnreadNotifications),
      mergeMap(({ userId }) =>
        this.authService.fetchUsersUnreadNotifications(userId).pipe(
          map(
            (
              response: Array<
                expirationNotificationDTO | relationshipRequestNotificationDTO
              >
            ) => {
              return notificationActions.fetchCaretakerRelationshipsSuccess({
                notifications: response,
              });
            }
          ),
          catchError((error) =>
            of(
              notificationActions.fetchCaretakerRelationshipsError({
                error: error.error || 'Fetch relationships failed',
              })
            )
          )
        )
      )
    )
  );
}
