import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

// Lazy load all service pages together
const SalesCloudPage = React.lazy(() => import('../pages/SalesCloudPage'));
const ServiceCloudPage = React.lazy(() => import('../pages/ServiceCloudPage'));
const MarketingCloudPage = React.lazy(() => import('../pages/MarketingCloudPage'));
// ...other service pages

// Loading component specific to service pages
const ServicesLoadingFallback = () => (
  <div className="p-8 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="h-16 bg-gray-200 animate-pulse rounded-lg mb-8 w-1/3"></div>
      <div className="h-64 bg-gray-200 animate-pulse rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
);

export const ServiceRoutes = () => (
  <Suspense fallback={<ServicesLoadingFallback />}>
    <Route path="/services/sales-cloud" element={<SalesCloudPage />} />
    <Route path="/services/service-cloud" element={<ServiceCloudPage />} />
    <Route path="/services/marketing-cloud" element={<MarketingCloudPage />} />
    {/* ...other service routes */}
  </Suspense>
); 