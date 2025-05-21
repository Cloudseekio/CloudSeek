import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';

// Notification types for different visual appearances
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Position for toasts to appear on screen
export type NotificationPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

// Core notification data structure
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  dismissible?: boolean;
  position?: NotificationPosition;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  createdAt: number;
}

// Options when creating a notification
export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  autoClose?: boolean;
  duration?: number;
  dismissible?: boolean;
  position?: NotificationPosition;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
}

// State interface
interface NotificationState {
  notifications: Notification[];
  config: {
    defaultDuration: number;
    defaultPosition: NotificationPosition;
    maxNotifications: number;
    defaultAutoClose: boolean;
  };
}

// Available actions for the reducer
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<NotificationState['config']> };

// Context type
interface NotificationContextType extends NotificationState {
  notify: (message: string, options?: NotificationOptions) => string;
  info: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  success: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  error: (message: string, options?: Omit<NotificationOptions, 'type'>) => string;
  remove: (id: string) => void;
  clearAll: () => void;
  updateConfig: (config: Partial<NotificationState['config']>) => void;
}

// Default config
const defaultConfig = {
  defaultDuration: 5000,
  defaultPosition: 'top-right' as NotificationPosition,
  maxNotifications: 5,
  defaultAutoClose: true,
};

// Initial state
const initialState: NotificationState = {
  notifications: [],
  config: defaultConfig,
};

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Reducer for state management
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      // Enforce max notifications limit
      const notifications = [
        action.payload,
        ...state.notifications,
      ].slice(0, state.config.maxNotifications);
      
      return {
        ...state,
        notifications,
      };
    }
      
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload.id
        ),
      };
      
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
      
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload,
        },
      };
      
    default:
      return state;
  }
}

// Helper to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const createNotification = useCallback(
    (message: string, options?: NotificationOptions): string => {
      const id = generateId();
      const notification: Notification = {
        id,
        type: options?.type || 'info',
        title: options?.title,
        message,
        autoClose: options?.autoClose ?? state.config.defaultAutoClose,
        duration: options?.duration || state.config.defaultDuration,
        dismissible: options?.dismissible ?? true,
        position: options?.position || state.config.defaultPosition,
        onClose: options?.onClose,
        actions: options?.actions || [],
        createdAt: Date.now(),
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      return id;
    },
    [state.config]
  );

  const notify = useCallback(
    (message: string, options?: NotificationOptions) => 
      createNotification(message, options),
    [createNotification]
  );

  const info = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => 
      createNotification(message, { ...options, type: 'info' }),
    [createNotification]
  );

  const success = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => 
      createNotification(message, { ...options, type: 'success' }),
    [createNotification]
  );

  const warning = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => 
      createNotification(message, { ...options, type: 'warning' }),
    [createNotification]
  );

  const error = useCallback(
    (message: string, options?: Omit<NotificationOptions, 'type'>) => 
      createNotification(message, { ...options, type: 'error' }),
    [createNotification]
  );

  const remove = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id } });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  }, []);

  const updateConfig = useCallback((config: Partial<NotificationState['config']>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  // Auto-removal of notifications based on duration
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    state.notifications.forEach((notification) => {
      if (notification.autoClose) {
        const timeout = setTimeout(() => {
          remove(notification.id);
          if (notification.onClose) {
            notification.onClose();
          }
        }, notification.duration);
        
        timeouts.push(timeout);
      }
    });
    
    // Cleanup timeouts on unmount or when notifications change
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [state.notifications, remove]);

  // Context value
  const value = {
    ...state,
    notify,
    info,
    success,
    warning,
    error,
    remove,
    clearAll,
    updateConfig,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 