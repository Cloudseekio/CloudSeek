import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  useNotification, 
  Notification, 
  NotificationPosition 
} from '../../context/NotificationContext';
import { Toast } from './Toast';
import './ToastContainer.css';

interface ToastContainerProps {
  containerClassName?: string;
  portalTarget?: HTMLElement;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  containerClassName = '',
  portalTarget,
}) => {
  const { notifications, remove, config } = useNotification();
  const [mounted, setMounted] = useState(false);
  
  // Create a target element if not provided
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Group notifications by position
  const notificationsByPosition = notifications.reduce<Record<NotificationPosition, Notification[]>>(
    (acc, notification) => {
      const position = notification.position || config.defaultPosition;
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(notification);
      return acc;
    },
    {} as Record<NotificationPosition, Notification[]>
  );

  // Get all positions that have notifications
  const activePositions = Object.keys(notificationsByPosition) as NotificationPosition[];

  const toastContainer = (
    <div className={`toast-container-wrapper ${containerClassName}`}>
      {activePositions.map((position) => (
        <div key={position} className={`toast-container toast-container-${position}`}>
          {notificationsByPosition[position].map((notification) => (
            <Toast
              key={notification.id}
              notification={notification}
              onClose={remove}
              autoClose={notification.autoClose}
              duration={notification.duration}
            />
          ))}
        </div>
      ))}
    </div>
  );

  // Use portal to render at the top level of the DOM
  return portalTarget
    ? createPortal(toastContainer, portalTarget)
    : createPortal(toastContainer, document.body);
}; 