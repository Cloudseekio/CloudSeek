import React from 'react';

interface ErrorMessageProps {
  title: string;
  message?: string;
  details?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  severity = 'error',
}) => {
  return (
    <div className="error-message" data-testid="error-message" data-severity={severity}>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ErrorMessage; 