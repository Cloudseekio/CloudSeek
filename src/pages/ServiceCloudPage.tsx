import React from 'react';
import { ChevronRight, CheckCircle, MessageSquare, ShieldCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ServiceCloudHeroSection from '../components/ServiceCloudHeroSection';

const ServiceCloudPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Salesforce Service Cloud Solutions | CloudSeek</title>
        <meta name="description" content="Deliver exceptional customer service with Salesforce Service Cloud. Increase agent productivity, resolve cases faster, and delight your customers." />
      </Helmet>
      
      {/* Hero Section with Service Cloud Dashboard */}
      <ServiceCloudHeroSection />

      {/* Key Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transform Your Customer Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Service Cloud empowers your team with the tools they need to deliver faster, smarter service across all channels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <MessageSquare size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Omnichannel Support
              </h3>
              <p className="text-gray-600">
                Connect with customers on their preferred channels—phone, email, social, chat, text, or in-person—all from one console.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Increase Customer Satisfaction
              </h3>
              <p className="text-gray-600">
                Resolve issues faster and deliver personalized service that builds lasting customer relationships and loyalty.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <BarChart3 size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Maximize Agent Productivity
              </h3>
              <p className="text-gray-600">
                Empower agents with AI-powered tools, automation, and a unified workspace to handle more cases with less effort.
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
              Powerful Features for Modern Service Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to provide world-class customer service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Case Management
                </h3>
                <p className="text-gray-600">
                  Track and resolve customer issues efficiently with automated routing, queuing, and escalation rules.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Knowledge Base
                </h3>
                <p className="text-gray-600">
                  Create, organize, and share articles to help agents find answers quickly and provide consistent service.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein AI for Service
                </h3>
                <p className="text-gray-600">
                  Use AI to automate routine tasks, recommend solutions, and identify trends in your support data.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Service Console
                </h3>
                <p className="text-gray-600">
                  Give agents a complete view of the customer with all relevant information in one unified workspace.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Field Service Management
                </h3>
                <p className="text-gray-600">
                  Schedule and dispatch the right technician for every job, while providing mobile tools for on-site service.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Service Analytics
                </h3>
                <p className="text-gray-600">
                  Measure KPIs, identify trends, and make data-driven decisions to improve service quality and efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-10 md:p-16">
                <div className="inline-block bg-blue-600 rounded-full px-4 py-1 text-sm text-white font-medium mb-6">
                  CASE STUDY
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  How HealthPlus Reduced Support Response Time by 68%
                </h3>
                <p className="text-gray-300 mb-8">
                  See how we helped HealthPlus healthcare network implement Service Cloud to transform their patient support experience and dramatically improve response times.
                </p>
                <Link to="/case-studies/health-plus" className="flex items-center text-white font-medium">
                  Read the full case study
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/case-studies/health-plus.jpg" 
                  alt="HealthPlus Case Study" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Service Cloud Implementation Approach
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                CloudSeek provides a comprehensive approach to Service Cloud implementations, ensuring you get maximum value from your investment.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Assessment & Planning</h3>
                    <p className="text-gray-600">We analyze your service processes, challenges, and goals to develop a tailored implementation plan.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Custom Configuration</h3>
                    <p className="text-gray-600">We configure Service Cloud to match your specific service processes and integrate with your existing systems.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Change Management & Training</h3>
                    <p className="text-gray-600">We ensure smooth adoption with comprehensive training and change management strategies.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Continuous Optimization</h3>
                    <p className="text-gray-600">We provide ongoing support and regular optimization to ensure you're always getting the most from Service Cloud.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="/images/case-studies/global-tech.jpg" 
                alt="Service Cloud Implementation" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Cloud Live Demo Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src="/images/case-studies/health-tech-innovations.jpg" 
                alt="Service Cloud Demo" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                See Service Cloud in Action
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Schedule a personalized demo to see how Service Cloud can transform your customer service operations.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">See how the unified agent console streamlines support workflows</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Experience AI-powered case routing and resolution recommendations</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Learn how to deploy self-service options that customers love</p>
                </li>
              </ul>
              
              <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                Schedule Your Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to revolutionize your customer service?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Let our experts guide you through the transformation. Discover how Service Cloud can be tailored 
            to your specific business needs and drive measurable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition"
            >
              Schedule a Demo <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white border-2 border-blue-600 hover:bg-blue-50 text-blue-600 font-medium py-3 px-6 rounded-md transition"
            >
              Contact Our Team <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceCloudPage; 