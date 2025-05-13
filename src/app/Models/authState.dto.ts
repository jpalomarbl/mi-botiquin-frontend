import {
  expirationNotificationDTO,
  relationshipRequestNotificationDTO,
} from './notification.dto';
import { UserDTO } from './user.dto';

export interface AuthStateDTO {
  user: UserDTO | null;
  usersSearchResults: UserDTO[] | null;
  relationships: UserDTO[] | null;
  notifications: Array<
    expirationNotificationDTO | relationshipRequestNotificationDTO
  > | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
