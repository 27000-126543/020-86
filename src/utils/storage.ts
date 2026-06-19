import Taro from '@tarojs/taro';
import { ImplantCredential, BatchNotification, UserRole, PushedPatient } from '@/types';
import { mockCredentials } from '@/data/credentials';
import { mockNotifications } from '@/data/notifications';

const STORAGE_KEYS = {
  CREDENTIALS: 'implant_credentials',
  NOTIFICATIONS: 'implant_notifications',
  USER_ROLE: 'implant_user_role',
  CURRENT_PATIENT: 'implant_current_patient'
} as const;

const migrateCredential = (c: any): ImplantCredential => {
  return {
    id: c.id || `cred_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    patientName: c.patientName || '未知患者',
    patientPhone: c.patientPhone || '',
    brand: c.brand || '',
    model: c.model || '标准型号',
    batchNumber: c.batchNumber || '',
    toothPosition: c.toothPosition || '',
    doctorName: c.doctorName || '',
    implantDate: c.implantDate || '',
    status: c.status || 'confirmed',
    followUpDate: c.followUpDate || '',
    clinicName: c.clinicName || '仁爱口腔门诊部',
    clinicPhone: c.clinicPhone || '021-5555-1234',
    createdAt: c.createdAt || '',
    batchNotificationIds: Array.isArray(c.batchNotificationIds) ? c.batchNotificationIds : []
  };
};

const migrateNotification = (n: any): BatchNotification => {
  const migratePushedPatient = (p: any): PushedPatient => ({
    credentialId: p.credentialId || '',
    patientName: p.patientName || '',
    patientPhone: p.patientPhone || '',
    pushedAt: p.pushedAt || ''
  });
  return {
    id: n.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    batchNumber: n.batchNumber || '',
    brand: n.brand || '',
    supplierName: n.supplierName || '',
    noticeDate: n.noticeDate || '',
    noticeContent: n.noticeContent || '',
    affectedPatientCount: typeof n.affectedPatientCount === 'number' ? n.affectedPatientCount : 0,
    isPushed: typeof n.isPushed === 'boolean' ? n.isPushed : false,
    pushedPatients: Array.isArray(n.pushedPatients) ? n.pushedPatients.map(migratePushedPatient) : []
  };
};

export const loadCredentials = (): ImplantCredential[] => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEYS.CREDENTIALS);
    if (data && Array.isArray(data) && data.length > 0) {
      const migrated = data.map(migrateCredential);
      console.info('[Storage] Loaded credentials from storage, count:', migrated.length);
      return migrated;
    }
  } catch (e) {
    console.warn('[Storage] Failed to load credentials:', e);
  }
  const initialCreds = mockCredentials.map(migrateCredential);
  Taro.setStorageSync(STORAGE_KEYS.CREDENTIALS, initialCreds);
  console.info('[Storage] Initialized mock credentials, count:', initialCreds.length);
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
      const migrated = data.map(migrateNotification);
      console.info('[Storage] Loaded notifications from storage, count:', migrated.length);
      return migrated;
    }
  } catch (e) {
    console.warn('[Storage] Failed to load notifications:', e);
  }
  const initialNotifs = mockNotifications.map(migrateNotification);
  Taro.setStorageSync(STORAGE_KEYS.NOTIFICATIONS, initialNotifs);
  console.info('[Storage] Initialized mock notifications, count:', initialNotifs.length);
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
