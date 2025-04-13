import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { loginError, loginOAuthGetUserInfo } from '../auth/actions/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class OAuthRedirectGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const id = new URLSearchParams(window.location.search).get('id');

    if (id) {
      this.store.dispatch(loginOAuthGetUserInfo({ id: +id }));
    } else {
      this.store.dispatch(loginError({ error: 'Invalid OAuth redirect' }));
    }

    this.router.navigate(['/']);

    return true;
  }
}
