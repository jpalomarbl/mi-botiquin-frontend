import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './Components/Auth/login/login.component';
import { OauthErrorComponent } from './Components/Auth/oauth-error/oauth-error.component';
import { OAuthSuccessComponent } from './Components/Auth/oauth-success/oauth-success.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { HomeComponent } from './Components/Pages/home/home.component';
import { OAuthRedirectGuard } from './Guards/o-auth-redirect.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'oauth-success',
    canActivate: [OAuthRedirectGuard],
    component: OAuthSuccessComponent,
  },
  {
    path: 'oauth-error',
    component: OauthErrorComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
