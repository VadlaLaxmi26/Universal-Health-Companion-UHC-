
import { MedicationReminder, User } from '../types';

const STORAGE_KEYS = {
  USER: 'uhc_user_profile',
  REMINDERS: 'uhc_med_reminders',
  CHAT_HISTORY: 'uhc_chat_history',
};

export const db = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
  getReminders: (): MedicationReminder[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  },
  saveReminder: (reminder: MedicationReminder) => {
    const reminders = db.getReminders();
    reminders.push(reminder);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },
  updateReminder: (id: string, updates: Partial<MedicationReminder>) => {
    const reminders = db.getReminders().map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },
  deleteReminder: (id: string) => {
    const reminders = db.getReminders().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }
};
