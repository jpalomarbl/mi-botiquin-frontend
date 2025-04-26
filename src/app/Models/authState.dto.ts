import { UserDTO } from "./user.dto";

export interface AuthStateDTO {
  user: UserDTO | null;
  relationships: UserDTO[] | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};
