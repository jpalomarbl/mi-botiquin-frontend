import { ReminderDTO } from "./reminder.dto";

export interface MedicineDTO {
  id: number;
  name: string;
  reminder: ReminderDTO;
  unit: string;
  amount: number;
  dose: number;
  expirationDate: Date;
  nregistro: number;
  formaFarmaceuticaSimplificada?: string;
  viaAdmininstracion?: string;
};
