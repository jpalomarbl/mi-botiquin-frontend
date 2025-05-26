import { ReminderDTO } from "./reminder.dto";

export interface MedicineDTO {
  id?: number;
  name: string;
  reminder?: ReminderDTO | null;
  unit: string;
  amount: number;
  dose: string;
  expirationDate: Date;
  nregistro: number;
  formaFarmaceuticaSimplificada?: string;
  viaAdmininstracion?: string;
  technicalSheetUrl: string;
};
