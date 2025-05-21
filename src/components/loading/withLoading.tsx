import React from 'react';
import { LoadingOverlay } from './LoadingOverlay';

export interface WithLoadingProps {
  loadingKey?: string;
  blur?: boolean;
  fullScreen?: boolean;
  showMessage?: boolean;
}

export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithLoadingProps = {}
) {
  return function WithLoadingComponent(props: P) {
    return (
      <LoadingOverlay {...options}>
        <WrappedComponent {...props} />
      </LoadingOverlay>
    );
  };
}

// Example usage:
/*
const MyComponentWithLoading = withLoading(MyComponent, {
  loadingKey: 'my-component',
  blur: true,
  showMessage: true
});

// In your component:
const { startLoading, stopLoading } = useLoading();

useEffect(() => {
  startLoading('my-component', 'Loading data...');
  fetchData().finally(() => stopLoading('my-component'));
}, []);
*/ 