import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import './ProgressDemo.css';

export const ProgressDemo: React.FC = () => {
  const [basicProgress, setBasicProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [customProgress, setCustomProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Auto-increment progress for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setBasicProgress(prev => {
          const newValue = prev + 1;
          return newValue > 100 ? 0 : newValue;
        });
        
        setAnimatedProgress(prev => {
          const newValue = prev + 2;
          return newValue > 100 ? 0 : newValue;
        });
        
        setCustomProgress(prev => {
          const newValue = prev + 3;
          return newValue > 100 ? 0 : newValue;
        });
      }, 200);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleComplete = () => {
    console.log('Progress complete!');
  };

  const toggleProgress = () => {
    setIsRunning(prev => !prev);
  };

  const resetProgress = () => {
    setBasicProgress(0);
    setAnimatedProgress(0);
    setCustomProgress(0);
  };

  return (
    <div className="progress-demo">
      <h2>Progress Bar Examples</h2>
      
      <div className="progress-demo-controls">
        <button onClick={toggleProgress}>
          {isRunning ? 'Pause' : 'Start'} Progress
        </button>
        <button onClick={resetProgress}>Reset</button>
      </div>
      
      <div className="progress-demo-section">
        <h3>Basic Progress Bars</h3>
        
        <ProgressBar 
          value={basicProgress} 
          label="Default Progress Bar" 
          showValue
        />
        
        <ProgressBar 
          value={basicProgress} 
          label="Small Progress Bar" 
          size="sm"
          showValue
        />
        
        <ProgressBar 
          value={basicProgress} 
          label="Large Progress Bar" 
          size="lg"
          showValue
        />
      </div>
      
      <div className="progress-demo-section">
        <h3>Variants</h3>
        
        <ProgressBar 
          value={basicProgress} 
          label="Success" 
          variant="success"
          showValue
        />
        
        <ProgressBar 
          value={basicProgress} 
          label="Warning" 
          variant="warning"
          showValue
        />
        
        <ProgressBar 
          value={basicProgress} 
          label="Error" 
          variant="error"
          showValue
        />
        
        <ProgressBar 
          value={basicProgress} 
          label="Info" 
          variant="info"
          showValue
        />
      </div>
      
      <div className="progress-demo-section">
        <h3>Animated & Striped</h3>
        
        <ProgressBar 
          value={animatedProgress} 
          label="Animated Progress" 
          animated
          showValue
        />
        
        <ProgressBar 
          value={animatedProgress} 
          label="Striped Progress" 
          striped
          showValue
        />
        
        <ProgressBar 
          value={animatedProgress} 
          label="Animated & Striped" 
          animated
          striped
          showValue
        />
      </div>
      
      <div className="progress-demo-section">
        <h3>Indeterminate Progress</h3>
        
        <ProgressBar 
          label="Indeterminate Progress" 
          indeterminate
          description="Loading data..."
        />
        
        <ProgressBar 
          label="Indeterminate (Success)" 
          indeterminate
          variant="success"
        />
      </div>
      
      <div className="progress-demo-section">
        <h3>Custom Styling</h3>
        
        <ProgressBar 
          value={customProgress} 
          label="Custom Colors" 
          color="#8e44ad"
          backgroundColor="#f0e6f6"
          showValue
        />
        
        <ProgressBar 
          value={customProgress} 
          label="With Description" 
          description="This progress bar includes a helpful description below it"
          showValue
        />
        
        <ProgressBar 
          value={customProgress} 
          label="With Completion Callback" 
          onComplete={handleComplete}
          showValue
          description="Check console when progress reaches 100%"
        />
      </div>
      
      <div className="progress-demo-section">
        <h3>Value Format</h3>
        
        <ProgressBar 
          value={basicProgress} 
          max={100}
          label="Percentage Format (Default)" 
          valueFormat="percentage"
          showValue
        />
        
        <ProgressBar 
          value={basicProgress} 
          max={100}
          label="Value Format" 
          valueFormat="value"
          showValue
        />
      </div>
    </div>
  );
}; 