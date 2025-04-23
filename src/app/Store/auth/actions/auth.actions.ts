import { createAction, props } from '@ngrx/store';

import { LoginDTO, RegisterDTO } from '../../../Models/auth.dto';
import { UserDTO } from '../../../Models/user.dto';

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

export const checkSession = createAction('[Auth] Check Session');

export const checkSessionSuccess = createAction(
  '[Auth] Check Session Success',
  props<{ user: UserDTO }>()
);

export const checkSessionError = createAction(
  '[Auth] Check Session Error',
  props<{ error: string }>()
);
