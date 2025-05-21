import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

export type ProgressBarProps = {
  /** Current value of the progress bar */
  value?: number;
  /** Maximum value of the progress bar (default: 100) */
  max?: number;
  /** Whether to show the value as text inside the progress bar */
  showValue?: boolean;
  /** Format for the value display: 'percentage' (default) or 'value' */
  valueFormat?: 'percentage' | 'value';
  /** Whether to animate the progress bar */
  animated?: boolean;
  /** Whether to show a striped pattern */
  striped?: boolean;
  /** Visual variant of the progress bar */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Size of the progress bar */
  size?: 'sm' | 'md' | 'lg';
  /** Optional label displayed above the progress bar */
  label?: string;
  /** Optional description displayed below the progress bar */
  description?: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether the progress is indeterminate */
  indeterminate?: boolean;
  /** Custom color for the progress bar */
  color?: string;
  /** Custom background color for the progress container */
  backgroundColor?: string;
  /** Callback fired when progress reaches 100% */
  onComplete?: () => void;
};

// Define type for ARIA attributes with aria-valuenow
interface ProgressBarAriaAttributes extends React.AriaAttributes {
  'aria-valuenow'?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  showValue = false,
  valueFormat = 'percentage',
  animated = false,
  striped = false,
  variant = 'default',
  size = 'md',
  label,
  description,
  className = '',
  indeterminate = false,
  color,
  backgroundColor,
  onComplete,
}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState<'increasing' | 'decreasing' | null>(null);
  const [prevValue, setPrevValue] = useState(value);

  // Calculate percentage for width and display
  const percentage = Math.min(Math.max(0, value), max) / max * 100;
  
  // Format the display value
  const displayValue = valueFormat === 'percentage' 
    ? `${Math.round(percentage)}%` 
    : `${value}/${max}`;

  // Detect direction of progress change
  useEffect(() => {
    if (value > prevValue) {
      setDirection('increasing');
    } else if (value < prevValue) {
      setDirection('decreasing');
    }
    setPrevValue(value);
  }, [value, prevValue]);

  // Handle completion
  useEffect(() => {
    if (percentage >= 100 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    } else if (percentage < 100 && isComplete) {
      setIsComplete(false);
    }
  }, [percentage, isComplete, onComplete]);

  // Combine class names
  const containerClasses = [
    'progress-bar-container',
    indeterminate ? 'progress-bar-indeterminate' : '',
    striped ? 'progress-bar-striped' : '',
    animated && !indeterminate ? 'progress-bar-animated' : '',
    isComplete ? 'progress-bar-complete' : '',
    direction ? `progress-bar-${direction}` : '',
  ].filter(Boolean).join(' ');

  const wrapperClasses = [
    'progress-bar-wrapper',
    `progress-bar-${variant}`,
    `progress-bar-${size}`,
    className,
  ].filter(Boolean).join(' ');

  // Custom styles
  const containerStyle = backgroundColor ? { backgroundColor } : {};
  const barStyle = {
    width: indeterminate ? '100%' : `${percentage}%`,
    ...(color ? { backgroundColor: color } : {}),
  };

  // Create an object with the correct ARIA attributes
  const ariaProps: ProgressBarAriaAttributes = {
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuetext': indeterminate ? "Loading..." : displayValue,
  };

  // Add aria-valuenow only if not indeterminate
  if (!indeterminate) {
    ariaProps['aria-valuenow'] = value;
  }

  return (
    <div className={wrapperClasses}>
      {label && <div className="progress-bar-label">{label}</div>}
      <div 
        className={containerClasses} 
        style={containerStyle}
        role="progressbar"
        {...ariaProps}
      >
        <div className="progress-bar" style={barStyle}>
          {showValue && !indeterminate && (
            <span className="progress-bar-value">{displayValue}</span>
          )}
        </div>
      </div>
      {description && <div className="progress-bar-description">{description}</div>}
    </div>
  );
}; 