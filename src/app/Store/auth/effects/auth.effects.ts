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
import { WebSocketService } from 'src/app/Services/web-socket.service';
import * as AuthActions from '../actions/auth.actions';
import * as notificationActions from '../actions/notification.actions';
import * as userRelationshipActions from '../actions/userRelationships.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private webSocketService: WebSocketService,
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
          map((response: any) => {
            let notifications: Array<
              expirationNotificationDTO | relationshipRequestNotificationDTO
            > = [];

            response.forEach((notification: any) => {
              if (notification.type === 'relationship request') {
                notifications.push({
                  type: notification.type,
                  id1: notification.requesterId,
                  id2: notification.receiverId,
                  requesterFirstName: notification.requesterFirstName,
                  requesterLastName: notification.requesterLastName,
                  requesterEmail: notification.requesterEmail,
                  requesterRole: notification.requesterRole,
                } as relationshipRequestNotificationDTO);
              } else if (notification.type === 'expiration') {
                notifications.push({
                  type: notification.type,
                  id1: notification.requesterId,
                  id2: notification.receiverId,
                  medicineName: notification.medicineName,
                  medicineKitName: notification.medicineKitName,
                });
              }
            });

            return notificationActions.fetchCaretakerRelationshipsSuccess({
              notifications: notifications,
            });
          }),
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

  sendRelationshipRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationActions.sendRelationshipRequest),
      mergeMap(({ requesterId, receiverId }) =>
        this.webSocketService
          .sendRelationshipRequest({
            type: 'relationship request',
            id1: requesterId,
            id2: receiverId,
          })
          .pipe(
            map((result: boolean) => {
              if (result) {
                return notificationActions.sendRelationshipRequestSuccess();
              } else {
                return notificationActions.sendRelationshipRequestError({
                  error: 'WebSocket is not connected. Cannot send message.',
                });
              }
            }),
            catchError((error) =>
              of(
                notificationActions.sendRelationshipRequestError({
                  error: error.error || 'Fetch relationships failed',
                })
              )
            )
          )
      )
    )
  );

  acceptRelationshipRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.acceptRelationshipRequest),
      mergeMap(({ requesterId, receiverId, requesterRole }) => {
        console.log(requesterId, receiverId, requesterRole);

        return this.userRelationshipService
          .acceptRelationshipRequest(requesterId, receiverId, requesterRole)
          .pipe(
            map((response: UserDTO | null) => {
              if (response) {
                console.log(response);
                return userRelationshipActions.acceptRelationshipRequestSuccess(
                  {
                    relationship: response,
                  }
                );
              } else {
                return userRelationshipActions.acceptRelationshipRequestError({
                  error: 'There was an error while accepting the request.',
                });
              }
            }),
            catchError((error) =>
              of(
                userRelationshipActions.acceptRelationshipRequestError({
                  error: error.error || 'Fetch relationships failed',
                })
              )
            )
          );
      })
    )
  );

  removePatientCaretakerRelationship$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.removePatientCaretakerRelationship),
      mergeMap(({ patientId, caretakerId }) => {
        return this.userRelationshipService
          .removePatientCaretakerRelationship(patientId, caretakerId)
          .pipe(
            map((response: UserDTO) => {
              console.log(response);
              return userRelationshipActions.removePatientCaretakerRelationshipSuccess(
                {
                  caretakerId: caretakerId,
                }
              );
            }),
            catchError((error) =>
              of(
                userRelationshipActions.removePatientCaretakerRelationshipError(
                  {
                    error: error.error || 'Fetch relationships failed',
                  }
                )
              )
            )
          );
      })
    )
  );
  removePatientFamilyMemberRelationship$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userRelationshipActions.removePatientFamilyMemberRelationship),
      mergeMap(({ patientId, familyMemberId }) => {
        return this.userRelationshipService
          .removePatientFamilyMemberRelationship(patientId, familyMemberId)
          .pipe(
            map((response: UserDTO) => {
              console.log(response);
              return userRelationshipActions.removePatientFamilyMemberRelationshipSuccess(
                {
                  familyMemberId: familyMemberId,
                }
              );
            }),
            catchError((error) =>
              of(
                userRelationshipActions.removePatientFamilyMemberRelationshipError(
                  {
                    error: error.error || 'Fetch relationships failed',
                  }
                )
              )
            )
          );
      })
    )
  );
}
