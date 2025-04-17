import { MedicineKitDTO } from "./medicineKit.dto";

export interface MedicineStateDTO {
  medicineKits: MedicineKitDTO[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
};
