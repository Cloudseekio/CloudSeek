import React from 'react';
import './StatusIndicator.css';

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending' | 'idle' | 'running' | 'completed';

export interface StatusIndicatorProps {
  /**
   * Current status
   */
  status: StatusType;
  
  /**
   * Optional label to display next to the indicator
   */
  label?: string;
  
  /**
   * Optional variant to control the appearance
   */
  variant?: 'dot' | 'badge' | 'pill' | 'text';
  
  /**
   * Optional size
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Optional pulsing animation effect
   */
  pulse?: boolean;
  
  /**
   * Optional className
   */
  className?: string;
  
  /**
   * Optional animation
   */
  animated?: boolean;
  
  /**
   * Indicates if the status is enabled
   */
  enabled?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  variant = 'dot',
  size = 'md',
  pulse = false,
  className = '',
  animated = true,
  enabled = true,
}) => {
  // Helper to get readable status text
  const getStatusText = (status: StatusType): string => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      case 'pending':
        return 'Pending';
      case 'idle':
        return 'Idle';
      case 'running':
        return 'Running';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const defaultLabel = getStatusText(status);
  const displayLabel = label || defaultLabel;
  
  // Helper to get appropriate icon for the status
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'success':
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'info':
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'pending':
      case 'running':
        return (
          <svg className="status-icon rotating" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 5L16.24 7.83M7.76 16.17L4.93 19M19.07 19L16.24 16.17M7.76 7.83L4.93 5" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'idle':
      default:
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10H14V14H10V10ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" 
              fill="currentColor" />
          </svg>
        );
    }
  };

  const classes = [
    'status-indicator',
    `status-indicator-${variant}`,
    `status-indicator-${size}`,
    `status-${status}`,
    pulse && 'pulse',
    animated && 'animated',
    !enabled && 'disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role="status"
      aria-label={`Status: ${displayLabel}`}
      data-status={status}
    >
      {variant === 'dot' && (
        <>
          <span className="status-dot" aria-hidden="true"></span>
          {label && <span className="status-label">{label}</span>}
        </>
      )}
      
      {variant === 'badge' && (
        <>
          <span className="status-badge">
            {getStatusIcon(status)}
            <span>{displayLabel}</span>
          </span>
        </>
      )}
      
      {variant === 'pill' && (
        <span className="status-pill">
          {displayLabel}
        </span>
      )}
      
      {variant === 'text' && (
        <span className="status-text">
          {getStatusIcon(status)}
          <span>{displayLabel}</span>
        </span>
      )}
    </div>
  );
} 