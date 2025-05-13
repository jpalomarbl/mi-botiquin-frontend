export interface NotificationDTO {
  type: string;
  medicineId: number;
  medicineName: string;
  medicineKitId: number;
  medicineKitName: string;
}

export interface Notification1DTO {
  // If type is 'expired', id1: medicineId, id2: medicineKitId
  // If type is 'relationship request', id1: requesterId, id2: receiverId
  id1: number;
  id2: number;
  type: string;
}

export interface expirationNotificationDTO extends Notification1DTO {
  medicineName: string;
  medicineKitName: string;
}

export interface relationshipRequestNotificationDTO extends Notification1DTO {
  requesterFirstName: string;
  requesterLastName: string;
  requesterRole: string;
}
