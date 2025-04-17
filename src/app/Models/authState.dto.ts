import { UserDTO } from "./user.dto";

export interface AuthStateDTO {
  user: UserDTO | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
