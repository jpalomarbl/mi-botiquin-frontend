export interface ReminderDTO {
  id?: number;
  frequency: number;
  frequencyUnit: string;
  start: Date;
  finish?: Date;
  amount: number;
  medicineId?: number;
  medicineUnit: string;
  medicineName?: string;
  medicineKitName?: string;
  ownerId?: number | null;
  ownerFirstName?: string | null;
  ownerLastName?: string | null;
}
