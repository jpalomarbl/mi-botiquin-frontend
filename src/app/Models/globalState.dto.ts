import { MedicineStateDTO } from "./medicineState.dto";
import { AuthStateDTO } from "./authState.dto";

export interface GlobalStateDTO {
  auth: AuthStateDTO;
  medicine: MedicineStateDTO;
};
