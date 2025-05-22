// App.tsx - Main application component - Forced rebuild
import { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import MainLayout from './layouts/MainLayout';
import Home from './Home';
import NotFoundPage from './pages/NotFoundPage';
import { BlogProvider } from './context/BlogContext';
import HealthPlus from './pages/CaseStudies/HealthPlus';
import RetailMax from './pages/CaseStudies/RetailMax';
import TechSolutions from './pages/CaseStudies/TechSolutions';
import GlobalTech from './pages/CaseStudies/GlobalTech';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { useSafePWA } from './hooks/useSafePWA';
import Blog from './Blog';
import Training from './pages/Services/Training';
import Support from './pages/Services/Support';
import ConsentManager from './components/ConsentManager';
import useAnalytics from './hooks/useAnalytics';
import type { ReactNode } from 'react';

// Only Home, MainLayout, and NotFoundPage are directly imported
// Everything else uses lazy loading

// Group imports logically
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const IndustriesPage = lazy(() => import('./pages/IndustriesPage'));
const CompanyPage = lazy(() => import('./pages/CompanyPage'));

// Blog related pages - commented out unused import
// const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const DebugPage = lazy(() => import('./blog/pages/DebugPage'));
const BlogRedirect = lazy(() => import('./components/BlogRedirect'));

// Case Studies
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const CaseStudiesIndex = lazy(() => import('./pages/CaseStudies/index'));
const LuxeProperties = lazy(() => import('./pages/CaseStudies/LuxeProperties'));
const CoastalDevelopments = lazy(() => import('./pages/CaseStudies/CoastalDevelopments'));
const MetroPropertyManagement = lazy(() => import('./pages/CaseStudies/MetroPropertyManagement'));
const TechForward = lazy(() => import('./pages/CaseStudies/TechForward'));
const StrategicConsultingGroup = lazy(() => import('./pages/CaseStudies/StrategicConsultingGroup'));
const RetailNXT = lazy(() => import('./pages/CaseStudies/RetailNXT'));
const GlobalFinancialCorp = lazy(() => import('./pages/CaseStudies/GlobalFinancialCorp'));
const HealthTechInnovations = lazy(() => import('./pages/CaseStudies/HealthTechInnovations'));
const PrecisionManufacturing = lazy(() => import('./pages/CaseStudies/PrecisionManufacturing'));
const FashionForward = lazy(() => import('./pages/CaseStudies/FashionForward'));
const TechVision = lazy(() => import('./pages/CaseStudies/TechVision'));

// Service detail pages
const SalesCloudPage = lazy(() => import('./pages/SalesCloudPage'));
const ServiceCloudPage = lazy(() => import('./pages/ServiceCloudPage'));
const MarketingCloudPage = lazy(() => import('./pages/MarketingCloudPage'));
const ExperienceCloudPage = lazy(() => import('./pages/ExperienceCloudPage'));
const PardotPage = lazy(() => import('./pages/PardotPage'));
const EinsteinAIPage = lazy(() => import('./pages/EinsteinAIPage'));
const SalesforceImplementationPage = lazy(() => import('./pages/SalesforceImplementationPage'));
const CustomSalesforceSolutionsPage = lazy(() => import('./pages/CustomSalesforceSolutionsPage'));
const SalesforceConsultingPage = lazy(() => import('./pages/SalesforceConsultingPage'));
const StrategicDigitalMarketingPage = lazy(() => import('./pages/StrategicDigitalMarketingPage'));
const WebDesignPage = lazy(() => import('./pages/WebDesignPage'));
const MobileAppDevelopmentPage = lazy(() => import('./pages/MobileAppDevelopmentPage'));

// Info pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const TestRotatingText = lazy(() => import('./pages/TestRotatingText'));

// Import the LuxeHomeFurnishings case study
const LuxeHomeFurnishings = lazy(() => import('./pages/CaseStudies/LuxeHomeFurnishings'));

// Add imports for new pages
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Import the missing CustomersPage
const CustomersPage = lazy(() => import('./pages/CustomersPage'));

// Also make sure TestimonialsPage is imported since it was also flagged in linter errors
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));

// Import the new component
import CloudMindsSolutions from './pages/CaseStudies/CloudMindsSolutions';

// Import the DataFlowSystems component
import DataFlowSystems from './pages/CaseStudies/DataFlowSystems';

// ScrollToTop component to handle scrolling on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Wrapper component to initialize analytics
const AnalyticsWrapper = ({ children }: { children: ReactNode }) => {
  // Initialize analytics with our configuration
  useAnalytics({
    debug: true,
    excludePaths: ['/privacy', '/offline'],
    globalParams: {
      app_version: '1.0.0'
    }
  });
  
  return <>{children}</>;
};

// Wrapper component to conditionally show consent manager
const ConsentManagerWrapper = () => {
  const location = useLocation();
  
  // Don't show on privacy policy page
  if (location.pathname === '/privacy-policy') {
    return null;
  }
  
  return (
    <ConsentManager 
      autoShow={false}
      onConsentUpdate={(settings) => {
        console.log('Consent updated:', settings);
      }}
    />
  );
};

function App() {
  const { isOnline } = useSafePWA();

  return (
    <HelmetProvider>
      <BlogProvider>
        <Router>
          <AnalyticsWrapper>
            <ScrollToTop />
            <ErrorBoundary>
              {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
                  You are currently offline. Some features may be limited.
                </div>
              )}
              <PWAInstallPrompt />
              <ConsentManagerWrapper />
              <Suspense fallback={<LoadingFallback type="page" message="Loading CloudSeek..." />}>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    
                    {/* Main navigation pages */}
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/industries" element={<IndustriesPage />} />
                    <Route path="/case-studies" element={<CaseStudiesPage />} />
                    
                    {/* Blog routes - direct loading without nested routes */}
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/blogs/:slug" element={<BlogRedirect />} />
                    
                    <Route path="/debug" element={<DebugPage />} />
                    
                    {/* Rest of your routes */}
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/company" element={<CompanyPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/testimonials" element={<TestimonialsPage />} />
                    <Route path="/test-rotating-text" element={<TestRotatingText />} />
                    <Route path="/services/sales-cloud" element={<SalesCloudPage />} />
                    <Route path="/services/service-cloud" element={<ServiceCloudPage />} />
                    <Route path="/services/marketing-cloud" element={<MarketingCloudPage />} />
                    <Route path="/services/experience-cloud" element={<ExperienceCloudPage />} />
                    <Route path="/services/pardot" element={<PardotPage />} />
                    <Route path="/services/einstein-ai" element={<EinsteinAIPage />} />
                    <Route path="/services/salesforce-implementation" element={<SalesforceImplementationPage />} />
                    <Route path="/services/custom-salesforce-solutions" element={<CustomSalesforceSolutionsPage />} />
                    <Route path="/services/salesforce-consulting" element={<SalesforceConsultingPage />} />
                    <Route path="/services/strategic-digital-marketing" element={<StrategicDigitalMarketingPage />} />
                    <Route path="/services/web-design" element={<WebDesignPage />} />
                    <Route path="/services/mobile-development" element={<MobileAppDevelopmentPage />} />
                    <Route path="/case-studies/index" element={<CaseStudiesIndex />} />
                    <Route path="/case-studies/luxe-properties" element={<LuxeProperties />} />
                    <Route path="/case-studies/coastal-developments" element={<CoastalDevelopments />} />
                    <Route path="/case-studies/metro-property-management" element={<MetroPropertyManagement />} />
                    <Route path="/case-studies/techforward-customer-lifetime-value" element={<TechForward />} />
                    <Route path="/case-studies/strategic-consulting-group" element={<StrategicConsultingGroup />} />
                    <Route path="/case-studies/retailnxt-customer-retention" element={<RetailNXT />} />
                    <Route path="/case-studies/global-financial-corp" element={<GlobalFinancialCorp />} />
                    <Route path="/case-studies/health-tech-innovations" element={<HealthTechInnovations />} />
                    <Route path="/case-studies/healthtech-innovations" element={<HealthTechInnovations />} />
                    <Route path="/case-studies/precision-manufacturing" element={<PrecisionManufacturing />} />
                    <Route path="/case-studies/precisionmanufacturing-inc" element={<PrecisionManufacturing />} />
                    <Route path="/case-studies/luxehome-furnishings" element={<LuxeHomeFurnishings />} />
                    <Route path="/case-studies/fashion-forward" element={<FashionForward />} />
                    <Route path="/case-studies/tech-vision" element={<TechVision />} />
                    <Route path="/case-studies/health-plus" element={<HealthPlus />} />
                    <Route path="/case-studies/retail-max" element={<RetailMax />} />
                    <Route path="/case-studies/tech-solutions" element={<TechSolutions />} />
                    <Route path="/case-studies/global-tech" element={<GlobalTech />} />
                    <Route path="/case-studies/cloudminds-solutions" element={<CloudMindsSolutions />} />
                    <Route path="/case-studies/dataflow-systems" element={<DataFlowSystems />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/services/training" element={<Training />} />
                    <Route path="/services/support" element={<Support />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AnalyticsWrapper>
        </Router>
      </BlogProvider>
    </HelmetProvider>
  );
}

export default App;