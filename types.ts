
export enum UserRole {
  PATIENT = 'PATIENT',
  HEALTH_WORKER = 'HEALTH_WORKER',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  language: string;
  isLoggedIn: boolean;
}

export interface MedicationReminder {
  id: string;
  medication: string;
  time: string; // HH:mm
  taken: boolean;
  frequency: string;
}

export interface ClinicalProtocol {
  id: string;
  title: string;
  category: string;
  steps: string[];
  symptoms: string[];
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'DIABETES' | 'HYPERTENSION' | 'GENERAL';
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  isAudio?: boolean;
}
