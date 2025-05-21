import React, { useEffect, useState, useRef } from 'react';
import { Notification, NotificationType } from '../../context/NotificationContext';
import { FadeTransition } from '../animation/FadeTransition';
import './Toast.css';

interface ToastProps {
  notification: Notification;
  onClose: (id: string) => void;
  autoClose?: boolean;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  notification,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { id, type, title, message, actions, dismissible = true } = notification;

  // Start exit animation before actually removing
  const handleClose = () => {
    setVisible(false);
    // This delay should match the exit animation duration
    setTimeout(() => onClose(id), 300);
  };

  // Set up auto-close timer
  useEffect(() => {
    setVisible(true);

    if (autoClose) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoClose, duration]);

  // Pause timer on hover
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // Resume timer on mouse leave
  const handleMouseLeave = () => {
    if (autoClose) {
      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
  };

  // Helper to get appropriate icon based on notification type
  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="toast-icon success" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg className="toast-icon error" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="toast-icon warning" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="toast-icon info" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <FadeTransition
      in={visible}
      exitDuration={300}
      enterDuration={300}
      unmountOnExit
    >
      <div 
        className={`toast toast-${type}`}
        role="alert"
        aria-live="assertive"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-testid={`toast-${id}`}
      >
        <div className="toast-content">
          {getIconForType(type)}
          <div className="toast-text">
            {title && <h4 className="toast-title">{title}</h4>}
            <p className="toast-message">{message}</p>
          </div>
          {dismissible && (
            <button 
              className="toast-close-btn" 
              onClick={handleClose}
              aria-label="Close notification"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="toast-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`toast-action-btn ${action.variant || 'secondary'}`}
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {autoClose && (
          <div className="toast-progress">
            <div 
              className="toast-progress-inner"
              style={{ animationDuration: `${duration}ms` }}
            ></div>
          </div>
        )}
      </div>
    </FadeTransition>
  );
}; 