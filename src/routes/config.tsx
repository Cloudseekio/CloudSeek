import { createRouteSplitting } from '../utils/codeSplitting';

// Define route configuration with code splitting
const routes = [
  {
    path: '/',
    component: () => import('../pages/Home'),
    preload: true // Preload home page
  },
  {
    path: '/blog',
    component: () => import('../pages/Blog'),
    preload: true // Preload blog listing
  },
  {
    path: '/blog/:id',
    component: () => import('../pages/BlogPost'),
    preload: false // Load on demand
  },
  {
    path: '/blog/debug',
    component: () => import('../pages/BlogDebug'),
    preload: false // Load on demand as it's a debug page
  },
  {
    path: '/about',
    component: () => import('../pages/About'),
    preload: false
  },
  {
    path: '/performance',
    component: () => import('../pages/Performance'),
    preload: false // Load on demand as it's not frequently accessed
  }
];

// Create route splitting utilities
const {
  getComponent,
  preloadRoute,
  preloadAll,
  clearCache
} = createRouteSplitting(routes);

// Export route utilities
export {
  getComponent,
  preloadRoute,
  preloadAll,
  clearCache
};

// Export route configuration
export default routes; 