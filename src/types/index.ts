export type UserRole = 'patient' | 'clinic';

export type CredentialStatus = 'confirmed' | 'pending';

export type ToothPosition = '左上1' | '左上2' | '左上3' | '左上4' | '左上5' | '左上6' | '左上7' | '左上8' | '右上1' | '右上2' | '右上3' | '右上4' | '右上5' | '右上6' | '右上7' | '右上8' | '左下1' | '左下2' | '左下3' | '左下4' | '左下5' | '左下6' | '左下7' | '左下8' | '右下1' | '右下2' | '右下3' | '右下4' | '右下5' | '右下6' | '右下7' | '右下8';

export interface ImplantCredential {
  id: string;
  patientName: string;
  patientPhone: string;
  brand: string;
  model: string;
  batchNumber: string;
  toothPosition: string;
  doctorName: string;
  implantDate: string;
  status: CredentialStatus;
  followUpDate: string;
  clinicName: string;
  clinicPhone: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  treatmentType: string;
  status: 'waiting' | 'in_progress' | 'completed';
}

export interface BatchNotification {
  id: string;
  batchNumber: string;
  brand: string;
  supplierName: string;
  noticeDate: string;
  noticeContent: string;
  affectedPatientCount: number;
  isPushed: boolean;
}

export interface AppState {
  role: UserRole;
  credentials: ImplantCredential[];
  appointments: Appointment[];
  notifications: BatchNotification[];
  setRole: (role: UserRole) => void;
  addCredential: (credential: ImplantCredential) => void;
  pushNotification: (id: string) => void;
}
