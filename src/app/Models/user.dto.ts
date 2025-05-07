export interface UserDTO {
  id: number;
  role: string;
  email: string;
  firstName: string;
  lastName: string | null;
  verified?: boolean | null;
};
