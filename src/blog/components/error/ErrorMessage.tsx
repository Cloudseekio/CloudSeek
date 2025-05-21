import React from 'react';
import { AlertTriangle, XCircle, Info, AlertOctagon } from 'lucide-react';
import { cn } from '../../../utils/cn';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorMessageProps {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  details?: string;
  showDetails?: boolean;
  className?: string;
  onRetry?: () => void;
  retryLabel?: string;
  retryCount?: number;
  maxRetries?: number;
}

const severityConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-400',
    buttonColor: 'bg-blue-100 hover:bg-blue-200 text-blue-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-400',
    buttonColor: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    iconColor: 'text-red-400',
    buttonColor: 'bg-red-100 hover:bg-red-200 text-red-700'
  },
  critical: {
    icon: AlertOctagon,
    bgColor: 'bg-red-100',
    textColor: 'text-red-900',
    borderColor: 'border-red-300',
    iconColor: 'text-red-600',
    buttonColor: 'bg-red-200 hover:bg-red-300 text-red-900'
  }
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  severity = 'error',
  details,
  showDetails = false,
  className,
  onRetry,
  retryLabel = 'Try Again',
  retryCount = 0,
  maxRetries = 3
}) => {
  const [isDetailsVisible, setIsDetailsVisible] = React.useState(showDetails);
  const config = severityConfig[severity];
  const Icon = config.icon;

  const canRetry = onRetry && (maxRetries === 0 || retryCount < maxRetries);

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', config.iconColor)} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={cn('text-sm font-medium', config.textColor)}>
            {title}
          </h3>
          <div className={cn('mt-2 text-sm', config.textColor)}>
            <p>{message}</p>
            {details && (
              <div className="mt-2">
                <button
                  type="button"
                  className={cn(
                    'flex items-center text-sm font-medium underline',
                    config.textColor
                  )}
                  onClick={() => setIsDetailsVisible(!isDetailsVisible)}
                >
                  {isDetailsVisible ? 'Hide Details' : 'Show Details'}
                </button>
                {isDetailsVisible && (
                  <pre className="mt-2 whitespace-pre-wrap rounded bg-white/50 p-2 text-xs">
                    {details}
                  </pre>
                )}
              </div>
            )}
          </div>
          {canRetry && (
            <div className="mt-4">
              <button
                type="button"
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  config.buttonColor
                )}
                onClick={onRetry}
              >
                {retryLabel}
                {maxRetries > 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    ({retryCount}/{maxRetries})
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 