import { MedicineKitDTO } from "./medicineKit.dto";
import { ReminderDTO } from "./reminder.dto";

export interface MedicineStateDTO {
  medicineKits: MedicineKitDTO[];
  reminders: ReminderDTO[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
};
