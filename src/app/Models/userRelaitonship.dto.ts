import { UserDTO } from "./user.dto";

export interface UserRelationshipDTO {
  user1: UserDTO;
  patients: UserDTO[];
}
