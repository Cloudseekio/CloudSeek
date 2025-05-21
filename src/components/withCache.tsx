import React from 'react';
import { useCache } from '../hooks/useCache';

interface WithCacheProps {
  namespace: string;
  maxSize?: number;
}

export function withCache<P extends object>(
  WrappedComponent: React.ComponentType<P & { cache: ReturnType<typeof useCache> }>,
  { namespace, maxSize }: WithCacheProps
) {
  return function WithCacheComponent(props: P) {
    const cache = useCache(namespace, maxSize);
    
    return <WrappedComponent {...props} cache={cache} />;
  };
}

// Example usage:
/*
interface MyComponentProps {
  cache: ReturnType<typeof useCache>;
  // other props...
}

const MyComponent: React.FC<MyComponentProps> = ({ cache, ...props }) => {
  useEffect(() => {
    // Use cache
    const data = cache.get('key');
    if (!data) {
      // Fetch data
      const newData = fetchData();
      cache.set('key', newData);
    }
  }, [cache]);
  
  return <div>...</div>;
};

export default withCache(MyComponent, { namespace: 'my-component' });
*/ 