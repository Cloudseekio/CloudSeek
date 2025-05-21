import React, { useEffect, useState } from 'react';
import { AlertTriangle, XCircle, Info, AlertOctagon, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorNotificationProps {
  title: string;
  message: string;
  severity?: NotificationSeverity;
  autoHideDuration?: number;
  className?: string;
  onClose?: () => void;
  action?: React.ReactNode;
  showIcon?: boolean;
}

const severityConfig = {
  info: {
    icon: Info,
    className: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100',
    iconClassName: 'text-blue-500 dark:text-blue-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100',
    iconClassName: 'text-yellow-500 dark:text-yellow-400'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-100',
    iconClassName: 'text-red-500 dark:text-red-400'
  },
  critical: {
    icon: AlertOctagon,
    className: 'bg-red-100 text-red-900 dark:bg-red-900/70 dark:text-red-50',
    iconClassName: 'text-red-600 dark:text-red-300'
  }
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  title,
  message,
  severity = 'error',
  autoHideDuration,
  className = '',
  onClose,
  action,
  showIcon = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = severityConfig[severity];
  const Icon = config.icon;

  useEffect(() => {
    if (autoHideDuration && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-lg p-4 mb-4',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        config.className,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={cn('w-5 h-5 mt-0.5', config.iconClassName)} aria-hidden="true" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={cn(
              'p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'focus:ring-current'
            )}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}; 
import { AlertTriangle, XCircle, Info, AlertOctagon, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorNotificationProps {
  title: string;
  message: string;
  severity?: NotificationSeverity;
  autoHideDuration?: number;
  className?: string;
  onClose?: () => void;
  action?: React.ReactNode;
  showIcon?: boolean;
}

const severityConfig = {
  info: {
    icon: Info,
    className: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100',
    iconClassName: 'text-blue-500 dark:text-blue-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100',
    iconClassName: 'text-yellow-500 dark:text-yellow-400'
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-100',
    iconClassName: 'text-red-500 dark:text-red-400'
  },
  critical: {
    icon: AlertOctagon,
    className: 'bg-red-100 text-red-900 dark:bg-red-900/70 dark:text-red-50',
    iconClassName: 'text-red-600 dark:text-red-300'
  }
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  title,
  message,
  severity = 'error',
  autoHideDuration,
  className = '',
  onClose,
  action,
  showIcon = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = severityConfig[severity];
  const Icon = config.icon;

  useEffect(() => {
    if (autoHideDuration && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-lg p-4 mb-4',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        config.className,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={cn('w-5 h-5 mt-0.5', config.iconClassName)} aria-hidden="true" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className={cn(
              'p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'focus:ring-current'
            )}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}; 