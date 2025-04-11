import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './Components/login/login.component';
import { OAuthSuccessComponent } from './Components/oauth-success/oauth-success.component';
import { OAuthRedirectGuard } from './Guards/o-auth-redirect.guard';
import { OauthErrorComponent } from './Components/oauth-error/oauth-error.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'oauth-success',
    canActivate: [OAuthRedirectGuard],
    component: OAuthSuccessComponent
  },
  {
    path: 'oauth-error',
    component: OauthErrorComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
