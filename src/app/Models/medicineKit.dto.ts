import { UserDTO } from "./user.dto";
import { MedicineDTO } from "./medicine.dto";

export interface MedicineKitDTO {
  id: number;
  owner: UserDTO;
  name: string;
  note: string;
  medicines: MedicineDTO[];
}
