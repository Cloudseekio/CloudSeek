import React, { useEffect, useState } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { useDelayedLoading } from '../../utils/loadingUtils';
import { cn } from '../../utils/cn';

interface LoadingSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  className?: string;
  suspenseKey?: string;
}

interface SuspenseState {
  isPending: boolean;
  error: Error | null;
}

const suspenseStates = new Map<string, SuspenseState>();

export const LoadingSuspense: React.FC<LoadingSuspenseProps> = ({
  children,
  fallback,
  delay = 200,
  className,
  suspenseKey = 'default'
}) => {
  const [state, setState] = useState<SuspenseState>(() => 
    suspenseStates.get(suspenseKey) || { isPending: false, error: null }
  );
  const showLoading = useDelayedLoading(state.isPending, delay);

  useEffect(() => {
    suspenseStates.set(suspenseKey, state);
    return () => {
      if (suspenseKey !== 'default') {
        suspenseStates.delete(suspenseKey);
      }
    };
  }, [state, suspenseKey]);

  if (state.error) {
    throw state.error;
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      {showLoading && (
        <div className="absolute inset-0">
          {fallback || <LoadingOverlay showMessage />}
        </div>
      )}
    </div>
  );
};

export function useSuspense(suspenseKey: string = 'default') {
  const startTransition = (callback: () => Promise<void>) => {
    const currentState = suspenseStates.get(suspenseKey) || { isPending: false, error: null };
    
    if (currentState.isPending) {
      return;
    }

    suspenseStates.set(suspenseKey, { ...currentState, isPending: true });
    
    callback()
      .catch(error => {
        suspenseStates.set(suspenseKey, { isPending: false, error });
      })
      .finally(() => {
        suspenseStates.set(suspenseKey, { isPending: false, error: null });
      });
  };

  return { startTransition };
}

export default LoadingSuspense;

// Example usage:
/*
function MyComponent() {
  const { startTransition } = useSuspense('my-component');

  const handleClick = () => {
    startTransition(async () => {
      await someAsyncOperation();
    });
  };

  return (
    <LoadingSuspense suspenseKey="my-component">
      <button onClick={handleClick}>Load Data</button>
    </LoadingSuspense>
  );
}
*/ 