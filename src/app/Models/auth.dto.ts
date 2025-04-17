import { UserDTO } from './user.dto';

export interface AuthStateDTO {
  user: UserDTO | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  firstName: string;
  lastName: string | null;
  role: string;
}
