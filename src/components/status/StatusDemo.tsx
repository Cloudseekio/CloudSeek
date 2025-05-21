import React, { useState } from 'react';
import { StatusIndicator, StatusType } from './StatusIndicator';
import './StatusDemo.css';

type VariantType = 'dot' | 'badge' | 'pill' | 'text';
type SizeType = 'sm' | 'md' | 'lg';

export const StatusDemo: React.FC = () => {
  const [status, setStatus] = useState<StatusType>('success');
  const [variant, setVariant] = useState<VariantType>('dot');
  const [size, setSize] = useState<SizeType>('md');
  const [label, setLabel] = useState('');
  const [pulse, setPulse] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [enabled, setEnabled] = useState(true);

  const statuses: StatusType[] = [
    'success',
    'error',
    'warning',
    'info',
    'pending',
    'idle',
    'running',
    'completed'
  ];

  const variants = [
    { value: 'dot' as VariantType, label: 'Dot' },
    { value: 'badge' as VariantType, label: 'Badge' },
    { value: 'pill' as VariantType, label: 'Pill' },
    { value: 'text' as VariantType, label: 'Text' }
  ];

  const sizes = [
    { value: 'sm' as SizeType, label: 'Small' },
    { value: 'md' as SizeType, label: 'Medium' },
    { value: 'lg' as SizeType, label: 'Large' }
  ];

  return (
    <div className="status-demo">
      <h2>Status Indicator Demo</h2>
      
      <div className="status-demo-controls">
        <div className="control-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value as StatusType)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="variant">Variant</label>
          <select 
            id="variant" 
            value={variant} 
            onChange={(e) => setVariant(e.target.value as VariantType)}
          >
            {variants.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="size">Size</label>
          <select 
            id="size" 
            value={size} 
            onChange={(e) => setSize(e.target.value as SizeType)}
          >
            {sizes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="label">Custom Label</label>
          <input 
            id="label" 
            type="text" 
            value={label} 
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Leave empty for default"
          />
        </div>
        
        <div className="control-group checkbox">
          <label htmlFor="pulse">
            <input 
              id="pulse" 
              type="checkbox" 
              checked={pulse} 
              onChange={(e) => setPulse(e.target.checked)}
            />
            Pulse Effect
          </label>
        </div>
        
        <div className="control-group checkbox">
          <label htmlFor="animated">
            <input 
              id="animated" 
              type="checkbox" 
              checked={animated} 
              onChange={(e) => setAnimated(e.target.checked)}
            />
            Animated
          </label>
        </div>
        
        <div className="control-group checkbox">
          <label htmlFor="enabled">
            <input 
              id="enabled" 
              type="checkbox" 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enabled
          </label>
        </div>
      </div>
      
      <div className="status-demo-preview">
        <h3>Preview</h3>
        <div className="preview-container">
          <StatusIndicator 
            status={status}
            variant={variant}
            size={size}
            label={label || undefined}
            pulse={pulse}
            animated={animated}
            enabled={enabled}
          />
        </div>
      </div>
      
      <div className="status-demo-examples">
        <h3>Examples</h3>
        <div className="examples-grid">
          {statuses.map((s) => (
            <div key={s} className="example-item">
              <h4>{s}</h4>
              <div className="example-variants">
                <div>
                  <StatusIndicator status={s} variant="dot" />
                </div>
                <div>
                  <StatusIndicator status={s} variant="badge" />
                </div>
                <div>
                  <StatusIndicator status={s} variant="pill" />
                </div>
                <div>
                  <StatusIndicator status={s} variant="text" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 