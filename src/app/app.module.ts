// Angular
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Store
import { AuthEffects } from './Store/auth/effects/auth.effects';
import { authReducer } from './Store/auth/reducers/auth.reducer';
import { MedicineKitEffects } from './Store/medicine/effects/medicineKit.effects';
import { ReminderEffects } from './Store/medicine/effects/reminder.effects';
import { medicineReducer } from './Store/medicine/reducer/medicine.reducer';

// Modules
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularMaterialModule } from './Modules/angular-material.module';
import { FormsModule } from './Modules/forms.module';

// Pipes
import { NextDosePipe } from './Pipes/next-dose.pipe';
import { ShortenTextPipe } from './Pipes/shorten-text.pipe';

// Components
import { OauthErrorComponent } from './Components/Auth/oauth-error/oauth-error.component';
import { OAuthSuccessComponent } from './Components/Auth/oauth-success/oauth-success.component';
import { FooterComponent } from './Components/Common/footer/footer.component';
import { HeaderComponent } from './Components/Common/header/header.component';
import { AddMedicineComponent } from './Components/Pages/add-medicine/add-medicine.component';
import { HomeComponent } from './Components/Pages/home/home.component';
import { AddMedicineKitComponent } from './Components/Pages/add-medicine-kit/add-medicine-kit.component';

@NgModule({
  declarations: [
    AppComponent,
    OAuthSuccessComponent,
    OauthErrorComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AddMedicineComponent,
    AddMedicineKitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ auth: authReducer }),
    StoreModule.forFeature('medicine', medicineReducer),
    EffectsModule.forRoot([AuthEffects, ReminderEffects, MedicineKitEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    BrowserAnimationsModule,
    CommonModule,
    AngularMaterialModule,
    AsyncPipe,
    NextDosePipe,
    ShortenTextPipe,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
