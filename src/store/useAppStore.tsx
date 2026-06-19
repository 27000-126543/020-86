import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, UserRole, ImplantCredential, BatchNotification } from '@/types';
import { mockCredentials } from '@/data/credentials';
import { mockAppointments } from '@/data/appointments';
import { mockNotifications } from '@/data/notifications';

type Action =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'ADD_CREDENTIAL'; payload: ImplantCredential }
  | { type: 'PUSH_NOTIFICATION'; payload: string };

const initialState: AppState = {
  role: 'patient',
  credentials: mockCredentials,
  appointments: mockAppointments,
  notifications: mockNotifications,
  setRole: () => {},
  addCredential: () => {},
  pushNotification: () => {}
};

function appReducer(state: AppState, action: Action): Omit<AppState, 'setRole' | 'addCredential' | 'pushNotification'> {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'ADD_CREDENTIAL':
      return { ...state, credentials: [action.payload, ...state.credentials] };
    case 'PUSH_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isPushed: true } : n
        )
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppState>(initialState);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setRole = (role: UserRole) => dispatch({ type: 'SET_ROLE', payload: role });
  const addCredential = (credential: ImplantCredential) => dispatch({ type: 'ADD_CREDENTIAL', payload: credential });
  const pushNotification = (id: string) => dispatch({ type: 'PUSH_NOTIFICATION', payload: id });

  const value: AppState = {
    ...state,
    setRole,
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
  }
  return context;
};
