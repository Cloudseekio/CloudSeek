import React, { useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getComponent, preloadRoute } from '../../routes/config';

interface SplitRouteProps {
  path: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
  </div>
);

export function SplitRoute({ path, fallback = <DefaultLoadingFallback />, children }: SplitRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the code-split component
  const RouteComponent = getComponent(path);

  // Handle 404 navigation
  useEffect(() => {
    if (!RouteComponent) {
      navigate('/404', { replace: true });
    }
  }, [RouteComponent, navigate]);

  if (!RouteComponent) {
    return null;
  }

  // Preload adjacent routes on hover
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    // Get all links in the current view
    const links = Array.from(event.currentTarget.getElementsByTagName('a'));
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href !== location.pathname) {
        // Preload the route when hovering over links
        preloadRoute(href);
      }
    });
  };

  const SplitComponent = RouteComponent as React.ComponentType<{ children?: React.ReactNode }>;

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Suspense fallback={fallback}>
        <SplitComponent>
          {children}
        </SplitComponent>
      </Suspense>
    </div>
  );
}

// Export a higher-order component for route splitting
export function withRouteSplitting<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    preloadPaths?: string[];
    fallback?: React.ReactNode;
  } = {}
) {
  const { preloadPaths = [], fallback } = options;

  return function WrappedComponent(props: P) {
    const location = useLocation();
    
    // Preload specified routes when component mounts
    useEffect(() => {
      preloadPaths.forEach(path => {
        preloadRoute(path);
      });
    }, []);

    return (
      <SplitRoute
        path={location.pathname}
        fallback={fallback}
      >
        <Component {...props} />
      </SplitRoute>
    );
  };
} 