import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './Components/Auth/login/login.component';
import { OauthErrorComponent } from './Components/Auth/oauth-error/oauth-error.component';
import { OAuthSuccessComponent } from './Components/Auth/oauth-success/oauth-success.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { HomeComponent } from './Components/Pages/home/home.component';
import { OAuthRedirectGuard } from './Guards/o-auth-redirect.guard';
import { RemindersListComponent } from './Components/Pages/reminders-list/reminders-list.component';
import { MedicineKitsListComponent } from './Components/Pages/medicine-kits-list/medicine-kits-list.component';

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
    path: 'remindersList/forwards/:daysDisplaced',
    component: RemindersListComponent
  },
  {
    path: 'remindersList/backwards/:daysDisplaced',
    component: RemindersListComponent
  },
  {
    path: 'remindersList',
    component: RemindersListComponent
  },
  {
    path: 'remindersList/:userId/forwards/:daysDisplaced',
    component: RemindersListComponent
  },
  {
    path: 'remindersList/:userId/backwards/:daysDisplaced',
    component: RemindersListComponent
  },
  {
    path: 'remindersList/:userId',
    component: RemindersListComponent
  },

  {
    path: 'medicineKitsList',
    component: MedicineKitsListComponent
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
