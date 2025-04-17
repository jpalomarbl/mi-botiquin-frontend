import { createAction, props } from '@ngrx/store';

import { UserDTO } from '../../../Models/user.dto';
import { LoginDTO, RegisterDTO } from '../models/auth.dto';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginDTO }>()
);

export const loginOAuth = createAction('[Auth] Login OAuth');

export const loginOAuthGetUserInfo = createAction(
  '[Auth] Login OAuth Get User Info',
  props<{ id: number }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: UserDTO }>()
);

export const loginError = createAction(
  '[Auth] Login Error',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterDTO }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: UserDTO }>()
);

export const registerError = createAction(
  '[Auth] Register Error',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutError = createAction(
  '[Auth] Logout Error',
  props<{ error: string }>()
);
