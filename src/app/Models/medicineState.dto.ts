import { MedicineKitDTO } from './medicineKit.dto';
import { ReminderDTO } from './reminder.dto';
import { MedicineDTO } from './medicine.dto';

export interface MedicineStateDTO {
  medicineKits: MedicineKitDTO[];
  reminders: ReminderDTO[];
  organizedReminders: Array<[Date, [ReminderDTO, boolean][]] | null>;
  medicinesSearch: MedicineDTO[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
