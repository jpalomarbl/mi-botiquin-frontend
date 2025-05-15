
export interface NotificationDTO {
  // If type is 'expired', id1: medicineId, id2: medicineKitId
  // If type is 'relationship request', id1: requesterId, id2: receiverId
  id1: number;
  id2: number;
  type: string;
}

export interface expirationNotificationDTO extends NotificationDTO {
  medicineName: string;
  medicineKitName: string;
}

export interface relationshipRequestNotificationDTO extends NotificationDTO {
  requesterFirstName: string;
  requesterLastName: string;
  requesterEmail: string;
  requesterRole: string;
}
