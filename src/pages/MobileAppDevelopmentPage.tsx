import React from 'react';
import { ChevronRight, CheckCircle, Smartphone, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileAppDevelopmentPage: React.FC = () => {
  // Example portfolio projects
  const portfolioProjects = [
    {
      title: "HealthTrack Pro",
      type: "Healthcare App",
      description: "Comprehensive health monitoring app with wearable integration and telehealth features",
      image: "/images/portfolio/health-app.jpg"
    },
    {
      title: "FinConnect",
      type: "Financial App",
      description: "Personal finance management with budgeting tools and investment tracking",
      image: "/images/portfolio/finance-app.jpg"
    },
    {
      title: "RetailGo",
      type: "E-Commerce App",
      description: "Feature-rich retail platform with AR product visualization and loyalty program",
      image: "/images/portfolio/retail-app.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Native & Cross-Platform Mobile Solutions
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Powerful, intuitive mobile applications that engage users and deliver exceptional experiences across all devices.
              </p>
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-block"
              >
                Start Your Mobile Project
              </Link>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <img 
                src="/images/mobile-development-hero.jpg" 
                alt="Mobile App Development" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Mobile Development Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end solutions for businesses looking to expand their digital presence to mobile platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Smartphone size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Native iOS Development
              </h3>
              <p className="text-gray-600">
                High-performance iOS applications built with Swift and optimized for Apple's ecosystem with seamless iCloud integration.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Smartphone size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Native Android Development
              </h3>
              <p className="text-gray-600">
                Feature-rich Android applications built with Kotlin to deliver exceptional experiences across the diverse Android ecosystem.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Layers size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cross-Platform Solutions
              </h3>
              <p className="text-gray-600">
                Cost-effective React Native and Flutter applications that maintain native-like performance while sharing a single codebase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mobile Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured, collaborative approach that delivers exceptional mobile applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discovery & Planning</h3>
              <p className="text-gray-600">
                We analyze your business needs, user requirements, and technical considerations to create a comprehensive roadmap.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">UI/UX Design</h3>
              <p className="text-gray-600">
                We create intuitive, engaging user interfaces that align with platform guidelines and your brand identity.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Development & Testing</h3>
              <p className="text-gray-600">
                Our engineers write clean, maintainable code and conduct thorough testing across devices and scenarios.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deployment & Support</h3>
              <p className="text-gray-600">
                We handle app store submissions and provide ongoing maintenance and feature enhancements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Mobile Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A selection of our recent mobile development work across various industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolioProjects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-blue-600 text-sm font-semibold">{project.type}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <a href="#" className="text-blue-600 font-medium flex items-center">
                    View Case Study <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Business Impact of Mobile Apps
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Investing in mobile applications provides tangible benefits that drive growth and customer engagement
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Enhanced Customer Engagement</h3>
                    <p className="text-gray-600">Direct access to your customers through their most personal devices.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Increased Brand Loyalty</h3>
                    <p className="text-gray-600">Apps with loyalty features keep customers coming back and increase lifetime value.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Valuable Customer Insights</h3>
                    <p className="text-gray-600">Gather rich data on user behavior to inform business decisions.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Advantage</h3>
                    <p className="text-gray-600">Stay ahead of competitors with innovative mobile experiences.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="/images/mobile-benefits.jpg" 
                alt="Mobile App Benefits" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonial Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-10 md:p-16">
                <div className="text-blue-100 mb-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="feather feather-message-circle"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  CloudSeek delivered a mobile app that exceeded our expectations. User engagement has increased by 78% and our customer acquisition cost has decreased significantly.
                </h3>
                <div className="flex items-center">
                  <img 
                    src="/images/client-avatar-2.jpg" 
                    alt="Client" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-white font-bold">Michael Chen</p>
                    <p className="text-blue-100">CTO, FinTech Innovations</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/mobile-testimonial.jpg" 
                  alt="Mobile App Screenshot" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Build Your Mobile Application?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Let's discuss how our mobile development expertise can help you create an exceptional app that drives business results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Start Your Project
            </Link>
            <Link 
              to="/case-studies" 
              className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileAppDevelopmentPage; 