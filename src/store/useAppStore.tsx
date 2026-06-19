import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { AppState, UserRole, ImplantCredential, BatchNotification, PushedPatient } from '@/types';
import { mockAppointments } from '@/data/appointments';
import {
  loadCredentials,
  saveCredentials,
  loadNotifications,
  saveNotifications,
  loadRole,
  saveRole,
  loadCurrentPatient,
  saveCurrentPatient
} from '@/utils/storage';
import dayjs from 'dayjs';

type Action =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_CURRENT_PATIENT'; payload: { phone: string; name: string } }
  | { type: 'ADD_CREDENTIAL'; payload: ImplantCredential }
  | { type: 'PUSH_NOTIFICATION'; payload: { notificationId: string; pushedPatients: PushedPatient[] } }
  | { type: 'SET_CREDENTIALS'; payload: ImplantCredential[] }
  | { type: 'SET_NOTIFICATIONS'; payload: BatchNotification[] };

const initialRole = loadRole();
const initialPatient = loadCurrentPatient();
const initialCredentials = loadCredentials();
const initialNotifications = loadNotifications();

const initialState: Omit<AppState, 'setRole' | 'setCurrentPatient' | 'addCredential' | 'pushNotification'> = {
  role: initialRole,
  currentPatientPhone: initialPatient.phone,
  currentPatientName: initialPatient.name,
  credentials: initialCredentials,
  appointments: mockAppointments,
  notifications: initialNotifications,
  filteredCredentials: [],
  filteredNotifications: []
};

function appReducer(
  state: typeof initialState,
  action: Action
): typeof initialState {
  switch (action.type) {
    case 'SET_ROLE':
      saveRole(action.payload);
      return { ...state, role: action.payload };
    case 'SET_CURRENT_PATIENT':
      saveCurrentPatient(action.payload.phone, action.payload.name);
      return {
        ...state,
        currentPatientPhone: action.payload.phone,
        currentPatientName: action.payload.name
      };
    case 'ADD_CREDENTIAL': {
      const newCredentials = [action.payload, ...state.credentials];
      saveCredentials(newCredentials);
      return { ...state, credentials: newCredentials };
    }
    case 'PUSH_NOTIFICATION': {
      const { notificationId, pushedPatients } = action.payload;
      const newNotifications = state.notifications.map(n =>
        n.id === notificationId
          ? { ...n, isPushed: true, pushedPatients: [...n.pushedPatients, ...pushedPatients] }
          : n
      );
      saveNotifications(newNotifications);
      const newCredentials = state.credentials.map(c => {
        const notif = newNotifications.find(n => n.id === notificationId);
        if (notif && c.batchNumber === notif.batchNumber) {
          if (!c.batchNotificationIds.includes(notificationId)) {
            return {
              ...c,
              batchNotificationIds: [...c.batchNotificationIds, notificationId]
            };
          }
        }
        return c;
      });
      saveCredentials(newCredentials);
      return { ...state, notifications: newNotifications, credentials: newCredentials };
    }
    default:
      return state;
  }
}

const AppContext = createContext<AppState>(null as unknown as AppState);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const filteredCredentials = useMemo(() => {
    if (state.role === 'clinic') {
      return state.credentials;
    }
    return state.credentials.filter(
      c => c.patientPhone === state.currentPatientPhone
    );
  }, [state.role, state.credentials, state.currentPatientPhone]);

  const filteredNotifications = useMemo(() => {
    if (state.role === 'clinic') {
      return state.notifications;
    }
    const myCredIds = filteredCredentials.map(c => c.id);
    return state.notifications.filter(n =>
      n.pushedPatients.some(p => myCredIds.includes(p.credentialId))
    );
  }, [state.role, state.notifications, filteredCredentials]);

  const setRole = (role: UserRole) => {
    dispatch({ type: 'SET_ROLE', payload: role });
    console.info('[AppStore] Role changed to:', role);
  };

  const setCurrentPatient = (phone: string, name: string) => {
    dispatch({ type: 'SET_CURRENT_PATIENT', payload: { phone, name } });
    console.info('[AppStore] Current patient set:', name, phone);
  };

  const addCredential = (credential: ImplantCredential) => {
    dispatch({ type: 'ADD_CREDENTIAL', payload: credential });
    console.info('[AppStore] Credential added:', credential.id);
  };

  const pushNotification = (notificationId: string): { pushedPatients: string[] } => {
    const notification = state.notifications.find(n => n.id === notificationId);
    if (!notification) {
      console.error('[AppStore] Notification not found:', notificationId);
      return { pushedPatients: [] };
    }
    const affectedCredentials = state.credentials.filter(
      c => c.batchNumber === notification.batchNumber
    );
    const pushedPatients: PushedPatient[] = affectedCredentials.map(c => ({
      credentialId: c.id,
      patientName: c.patientName,
      patientPhone: c.patientPhone,
      pushedAt: dayjs().format('YYYY-MM-DD HH:mm')
    }));
    dispatch({
      type: 'PUSH_NOTIFICATION',
      payload: { notificationId, pushedPatients }
    });
    console.info('[AppStore] Notification pushed:', notificationId, 'patients:', pushedPatients.length);
    return { pushedPatients: pushedPatients.map(p => p.patientName) };
  };

  const value: AppState = {
    ...state,
    filteredCredentials,
    filteredNotifications,
    setRole,
    setCurrentPatient,
    addCredential,
    pushNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('[AppStore] Context not found');
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
};
