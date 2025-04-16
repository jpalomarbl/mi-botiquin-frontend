import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { authReducer } from './reducers/auth.reducer';
import { AuthEffects } from './effects/auth.effects';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('auth', authReducer, {}),
    EffectsModule.forFeature([AuthEffects])
  ],
  providers: [AuthService]
})
export class AuthModule {}
