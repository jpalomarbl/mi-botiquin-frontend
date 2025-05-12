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
import { MedicineKitDetailsComponent } from './Components/Pages/medicine-kit-details/medicine-kit-details.component';
import { AddMedicineKitComponent } from './Components/Pages/add-medicine-kit/add-medicine-kit.component';
import { SearchMedicineComponent } from './Components/Pages/search-medicine/search-medicine.component';
import { AddMedicineComponent } from './Components/Pages/add-medicine/add-medicine.component';
import { UserConfigComponent } from './Components/Pages/user-config/user-config.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
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
    component: RemindersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'remindersList/backwards/:daysDisplaced',
    component: RemindersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'remindersList',
    component: RemindersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'remindersList/:userId/forwards/:daysDisplaced',
    component: RemindersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'remindersList/:userId/backwards/:daysDisplaced',
    component: RemindersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'remindersList/:userId',
    component: RemindersListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'medicineKitsList',
    component: MedicineKitsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'medicineKitDetails/:medicineKitId',
    component: MedicineKitDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addMedicineKit',
    component: AddMedicineKitComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'searchMedicine/:medicineKitId',
    component: SearchMedicineComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addMedicine/:medicineKitId/:medicine',
    component: AddMedicineComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'userConfig',
    component: UserConfigComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
