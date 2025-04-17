import { ReminderDTO } from "./reminder.dto";

export interface MedicineDTO {
  id: number;
  name: string;
  reminder: ReminderDTO;
  unit: string;
  amount: number;
  expirationDate: Date;
  nregistro: number;
};
