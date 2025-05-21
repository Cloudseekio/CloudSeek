import React, { useState } from 'react';
import { useNotification, NotificationPosition } from '../../context/NotificationContext';
import './NotificationDemo.css';

export const NotificationDemo: React.FC = () => {
  const {
    info,
    success,
    warning,
    error,
    clearAll,
    updateConfig,
    config,
  } = useNotification();

  const [message, setMessage] = useState('This is a notification message');
  const [title, setTitle] = useState('Notification');
  const [duration, setDuration] = useState(5000);
  const [position, setPosition] = useState<NotificationPosition>('top-right');
  const [autoClose, setAutoClose] = useState(true);

  const showNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const options = {
      title: title || undefined,
      duration,
      position,
      autoClose,
      actions: [
        {
          label: 'Action',
          onClick: () => console.log('Action clicked'),
          variant: 'primary' as const,
        },
        {
          label: 'Dismiss',
          onClick: () => console.log('Dismissed'),
          variant: 'secondary' as const,
        },
      ],
    };

    switch (type) {
      case 'info':
        info(message, options);
        break;
      case 'success':
        success(message, options);
        break;
      case 'warning':
        warning(message, options);
        break;
      case 'error':
        error(message, options);
        break;
    }
  };

  const updateNotificationConfig = () => {
    updateConfig({
      defaultPosition: position,
      defaultDuration: duration,
      defaultAutoClose: autoClose,
    });
  };

  return (
    <div className="notification-demo">
      <h2>Notification System Demo</h2>
      
      <div className="notification-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification message"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (ms)</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={1000}
            step={1000}
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position</label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value as NotificationPosition)}
          >
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-center">Top Center</option>
            <option value="bottom-center">Bottom Center</option>
          </select>
        </div>

        <div className="form-group checkbox">
          <label htmlFor="autoClose">
            <input
              id="autoClose"
              type="checkbox"
              checked={autoClose}
              onChange={(e) => setAutoClose(e.target.checked)}
            />
            Auto Close
          </label>
        </div>
      </div>

      <div className="notification-actions">
        <button
          className="action-btn info"
          onClick={() => showNotification('info')}
          aria-label="Show info notification"
        >
          Info
        </button>
        <button
          className="action-btn success"
          onClick={() => showNotification('success')}
          aria-label="Show success notification"
        >
          Success
        </button>
        <button
          className="action-btn warning"
          onClick={() => showNotification('warning')}
          aria-label="Show warning notification"
        >
          Warning
        </button>
        <button
          className="action-btn error"
          onClick={() => showNotification('error')}
          aria-label="Show error notification"
        >
          Error
        </button>
        <button
          className="action-btn secondary"
          onClick={clearAll}
          aria-label="Clear all notifications"
        >
          Clear All
        </button>
      </div>

      <div className="system-config">
        <h3>System Configuration</h3>
        <p>Current default position: {config.defaultPosition}</p>
        <p>Current default duration: {config.defaultDuration}ms</p>
        <p>Current auto close: {config.defaultAutoClose ? 'Yes' : 'No'}</p>
        <p>Max notifications: {config.maxNotifications}</p>
        <button 
          className="action-btn primary"
          onClick={updateNotificationConfig}
        >
          Update System Defaults
        </button>
      </div>
    </div>
  );
}; 