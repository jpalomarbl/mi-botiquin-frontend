import { UserDTO } from "./user.dto";
import { NotificationDTO } from "./notification.dto";

export interface AuthStateDTO {
  user: UserDTO | null;
  usersSearchResults: UserDTO[] | null;
  relationships: UserDTO[] | null;
  notifications: NotificationDTO[] | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};
