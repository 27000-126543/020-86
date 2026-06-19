import Taro from '@tarojs/taro';
import { ImplantCredential, BatchNotification, UserRole } from '@/types';
import { mockCredentials } from '@/data/credentials';
import { mockNotifications } from '@/data/notifications';

const STORAGE_KEYS = {
  CREDENTIALS: 'implant_credentials',
  NOTIFICATIONS: 'implant_notifications',
  USER_ROLE: 'implant_user_role',
  CURRENT_PATIENT: 'implant_current_patient'
} as const;

export const loadCredentials = (): ImplantCredential[] => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEYS.CREDENTIALS);
    if (data && Array.isArray(data) && data.length > 0) {
      console.info('[Storage] Loaded credentials from storage, count:', data.length);
      return data;
    }
  } catch (e) {
    console.warn('[Storage] Failed to load credentials:', e);
  }
  const initialCreds = mockCredentials.map(c => ({
    ...c,
    batchNotificationIds: [] as string[]
  }));
  initialCreds[0].batchNotificationIds = ['notif_001'];
  initialCreds[4].batchNotificationIds = ['notif_001'];
  initialCreds[3].batchNotificationIds = ['notif_004'];
  Taro.setStorageSync(STORAGE_KEYS.CREDENTIALS, initialCreds);
  return initialCreds;
};

export const saveCredentials = (credentials: ImplantCredential[]): void => {
  try {
    Taro.setStorageSync(STORAGE_KEYS.CREDENTIALS, credentials);
    console.info('[Storage] Saved credentials to storage, count:', credentials.length);
  } catch (e) {
    console.error('[Storage] Failed to save credentials:', e);
  }
};

export const loadNotifications = (): BatchNotification[] => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEYS.NOTIFICATIONS);
    if (data && Array.isArray(data) && data.length > 0) {
      console.info('[Storage] Loaded notifications from storage, count:', data.length);
      return data;
    }
  } catch (e) {
    console.warn('[Storage] Failed to load notifications:', e);
  }
  const initialNotifs = mockNotifications.map(n => ({
    ...n,
    pushedPatients: [] as any[]
  }));
  initialNotifs[0].pushedPatients = [
    { credentialId: 'cred_001', patientName: '张丽华', patientPhone: '138****6721', pushedAt: '2025-06-19 10:30' },
    { credentialId: 'cred_005', patientName: '孙志强', patientPhone: '135****5566', pushedAt: '2025-06-19 10:31' }
  ];
  initialNotifs[3].pushedPatients = [
    { credentialId: 'cred_004', patientName: '赵文静', patientPhone: '136****2233', pushedAt: '2025-06-20 09:15' }
  ];
  Taro.setStorageSync(STORAGE_KEYS.NOTIFICATIONS, initialNotifs);
  return initialNotifs;
};

export const saveNotifications = (notifications: BatchNotification[]): void => {
  try {
    Taro.setStorageSync(STORAGE_KEYS.NOTIFICATIONS, notifications);
    console.info('[Storage] Saved notifications to storage, count:', notifications.length);
  } catch (e) {
    console.error('[Storage] Failed to save notifications:', e);
  }
};

export const loadRole = (): UserRole => {
  try {
    const role = Taro.getStorageSync(STORAGE_KEYS.USER_ROLE);
    if (role === 'patient' || role === 'clinic') {
      return role;
    }
  } catch (e) {
    console.warn('[Storage] Failed to load role:', e);
  }
  return 'patient';
};

export const saveRole = (role: UserRole): void => {
  try {
    Taro.setStorageSync(STORAGE_KEYS.USER_ROLE, role);
  } catch (e) {
    console.error('[Storage] Failed to save role:', e);
  }
};

export const loadCurrentPatient = (): { phone: string; name: string } => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEYS.CURRENT_PATIENT);
    if (data && typeof data === 'object' && data.phone) {
      return { phone: data.phone, name: data.name || '患者' };
    }
  } catch (e) {
    console.warn('[Storage] Failed to load current patient:', e);
  }
  return { phone: '138****6721', name: '张丽华' };
};

export const saveCurrentPatient = (phone: string, name: string): void => {
  try {
    Taro.setStorageSync(STORAGE_KEYS.CURRENT_PATIENT, { phone, name });
  } catch (e) {
    console.error('[Storage] Failed to save current patient:', e);
  }
};
