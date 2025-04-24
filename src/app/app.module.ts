import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { OauthErrorComponent } from './Components/Auth/oauth-error/oauth-error.component';
import { OAuthSuccessComponent } from './Components/Auth/oauth-success/oauth-success.component';
import { AuthEffects } from './Store/auth/effects/auth.effects';
import { authReducer } from './Store/auth/reducers/auth.reducer';
import { MedicineKitEffects } from './Store/medicine/effects/medicineKit.effects';
import { ReminderEffects } from './Store/medicine/effects/reminder.effects';
import { medicineReducer } from './Store/medicine/reducer/medicine.reducer';
import { FooterComponent } from './Components/Common/footer/footer.component';

@NgModule({
  declarations: [AppComponent, OAuthSuccessComponent, OauthErrorComponent, FooterComponent],
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
      // connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
