import React from 'react';
import { Helmet } from 'react-helmet-async';
import ExperienceCloudHeroSection from '../components/ExperienceCloudHeroSection';
import { ChevronRight, CheckCircle, Users, Globe, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExperienceCloudPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Salesforce Experience Cloud Solutions | CloudSeek</title>
        <meta name="description" content="Create exceptional digital experiences with Salesforce Experience Cloud. Build beautiful, branded portals and communities for customers, partners, and employees." />
      </Helmet>
      
      {/* Hero Section with Experience Cloud Dashboard */}
      <ExperienceCloudHeroSection />

      {/* Key Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Digital Experiences for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience Cloud makes it easy to build connected digital experiences for all your stakeholders
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Customer Communities
              </h3>
              <p className="text-gray-600">
                Create self-service portals where customers can find answers, submit cases, and engage with your brand and each other.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Globe size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Partner Portals
              </h3>
              <p className="text-gray-600">
                Enable your partners with deal registration, lead management, and marketing resources to drive channel sales.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Layout size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Employee Experiences
              </h3>
              <p className="text-gray-600">
                Empower your workforce with personalized intranets that boost productivity and strengthen company culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Experience Cloud Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create engaging digital experiences that drive business value
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Drag-and-Drop Page Builder
                </h3>
                <p className="text-gray-600">
                  Create beautiful, responsive pages with Lightning Components and pre-built templates—no coding required.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  CMS Integration
                </h3>
                <p className="text-gray-600">
                  Manage content easily with Salesforce CMS to deliver personalized content across all your digital experiences.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mobile-Optimized
                </h3>
                <p className="text-gray-600">
                  Deliver responsive, mobile-friendly experiences that work seamlessly on any device.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Personalization Engine
                </h3>
                <p className="text-gray-600">
                  Deliver tailored content and recommendations based on user profiles, behavior, and context.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Multi-Language Support
                </h3>
                <p className="text-gray-600">
                  Create global experiences with built-in translation workspaces and language selector components.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Self-Service Tools
                </h3>
                <p className="text-gray-600">
                  Empower users with knowledge articles, case management, and discussion forums to find answers quickly.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Seamless Data Integration
                </h3>
                <p className="text-gray-600">
                  Connect to your Salesforce data and external systems for unified, 360-degree experiences.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  AI-Powered Recommendations
                </h3>
                <p className="text-gray-600">
                  Use Einstein AI to suggest content, products, and answers based on user behavior and needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience Cloud for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how different industries are transforming digital engagement with Experience Cloud
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200">
                <img 
                  src="/images/exp-healthcare.jpg" 
                  alt="Healthcare" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare</h3>
                <p className="text-gray-600 mb-4">
                  Create patient portals that simplify appointment scheduling, medical record access, and provider communication.
                </p>
                <Link to="#" className="text-blue-600 font-medium flex items-center">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200">
                <img 
                  src="/images/exp-financial.jpg" 
                  alt="Financial Services" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Services</h3>
                <p className="text-gray-600 mb-4">
                  Build secure client portals for account management, financial planning, and advisor collaboration.
                </p>
                <Link to="#" className="text-blue-600 font-medium flex items-center">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gray-200">
                <img 
                  src="/images/exp-manufacturing.jpg" 
                  alt="Manufacturing" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Manufacturing</h3>
                <p className="text-gray-600 mb-4">
                  Develop dealer/distributor portals for ordering, warranties, and technical support to streamline channel operations.
                </p>
                <Link to="#" className="text-blue-600 font-medium flex items-center">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-10 md:p-16">
                <div className="inline-block bg-blue-600 rounded-full px-4 py-1 text-sm text-white font-medium mb-6">
                  CASE STUDY
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  How Global Financial Increased Customer Satisfaction by 46%
                </h3>
                <p className="text-gray-300 mb-8">
                  Learn how we helped Global Financial build a personalized customer portal that simplified account management, improved self-service, and dramatically increased customer satisfaction scores.
                </p>
                <Link to="/case-studies/global-financial-corp" className="flex items-center text-white font-medium">
                  Read the full case study
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/case-study-experience.jpg" 
                  alt="Global Financial Case Study" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Experience Cloud Implementation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CloudSeek's comprehensive approach ensures your Experience Cloud implementation delivers maximum business value
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="h-2 bg-blue-600 absolute top-9 left-1/2 transform -translate-x-1/2 w-full md:w-full md:left-full md:-translate-x-1/2 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Discovery & Strategy</h3>
                <p className="text-gray-600">
                  We analyze user needs, business goals, and technical requirements to create a comprehensive strategy.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-2 bg-blue-600 absolute top-9 left-1/2 transform -translate-x-1/2 w-full md:w-full md:left-full md:-translate-x-1/2 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">UX Design & Branding</h3>
                <p className="text-gray-600">
                  Our design team creates intuitive, branded experiences that engage and delight your users.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-2 bg-blue-600 absolute top-9 left-1/2 transform -translate-x-1/2 w-full md:w-full md:left-full md:-translate-x-1/2 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Development & Integration</h3>
                <p className="text-gray-600">
                  We build your Experience Cloud site with custom components and seamless data integration.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Launch & Optimization</h3>
                <p className="text-gray-600">
                  We ensure a smooth launch and provide ongoing support to optimize performance over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Builder Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src="/images/experience-builder-demo.jpg" 
                alt="Experience Builder" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                See Experience Cloud in Action
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Request a personalized demo to see how Experience Cloud can transform your digital engagement strategy.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">See the drag-and-drop Experience Builder in action</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Explore pre-built templates for common use cases</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Learn how to integrate your Salesforce data and external systems</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Discover personalization capabilities that drive engagement</p>
                </li>
              </ul>
              
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                Request Your Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Let our Experience Cloud experts help you create engaging, personalized digital experiences that connect your customers, partners, and employees.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium">
              Start Your Project
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExperienceCloudPage; 