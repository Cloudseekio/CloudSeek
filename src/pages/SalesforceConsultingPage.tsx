import React from 'react';
import { ChevronRight, CheckCircle, BarChart3, Users, Briefcase, Cloud, Target, Zap, Shield, Award, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const SalesforceConsultingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Expert Salesforce Consulting for Optimal Results
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Strategic guidance and implementation expertise to maximize your Salesforce ROI and drive digital transformation.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
                <ChevronRight size={16} className="ml-2 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Salesforce Consulting Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic guidance and hands-on expertise to optimize your Salesforce investment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Briefcase size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Strategic Advisory
              </h3>
              <p className="text-gray-600">
                Expert guidance on Salesforce strategy, roadmap development, and business process optimization aligned with your objectives.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Cloud size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Platform Selection
              </h3>
              <p className="text-gray-600">
                Guidance on selecting the right Salesforce products and editions to meet your business requirements and budget.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Settings size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Implementation Support
              </h3>
              <p className="text-gray-600">
                Expert assistance throughout your Salesforce implementation to ensure best practices and successful adoption.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Target size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Process Optimization
              </h3>
              <p className="text-gray-600">
                Redesign and streamline business processes to take full advantage of Salesforce capabilities and drive efficiency.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                User Adoption & Training
              </h3>
              <p className="text-gray-600">
                Comprehensive training programs and change management strategies to ensure successful adoption across your organization.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <BarChart3 size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Analytics & Reporting
              </h3>
              <p className="text-gray-600">
                Design and implementation of custom reports, dashboards, and Einstein Analytics solutions for data-driven decision making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proven Methodology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Proven Consulting Methodology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured approach to delivering successful Salesforce outcomes
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 transform -translate-x-1/2"></div>

            <div className="space-y-16">
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-6 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 transform -translate-x-1/2"></div>
                
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-10 md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">1. Discovery & Assessment</h3>
                    <p className="text-gray-600">
                      Comprehensive analysis of your current processes, systems, and business objectives to establish a baseline and identify opportunities.
                    </p>
                  </div>
                  <div className="hidden md:block w-0"></div>
                  <div className="md:w-1/2 pl-10 md:mt-0 mt-6">
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-6 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 transform -translate-x-1/2"></div>
                
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-10 order-1 md:order-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">2. Strategic Planning</h3>
                    <p className="text-gray-600">
                      Development of a tailored roadmap that outlines how Salesforce will support your business objectives and growth plans.
                    </p>
                  </div>
                  <div className="hidden md:block w-0"></div>
                  <div className="md:w-1/2 pl-10 md:mt-0 mt-6 order-2 md:order-1">
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-6 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 transform -translate-x-1/2"></div>
                
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-10 md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">3. Solution Design</h3>
                    <p className="text-gray-600">
                      Detailed design of your Salesforce solution, including configuration requirements, customizations, integrations, and data models.
                    </p>
                  </div>
                  <div className="hidden md:block w-0"></div>
                  <div className="md:w-1/2 pl-10 md:mt-0 mt-6">
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-6 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 transform -translate-x-1/2"></div>
                
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-10 order-1 md:order-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">4. Implementation & Optimization</h3>
                    <p className="text-gray-600">
                      Expert guidance throughout implementation, ensuring best practices are followed and the solution meets your requirements.
                    </p>
                  </div>
                  <div className="hidden md:block w-0"></div>
                  <div className="md:w-1/2 pl-10 md:mt-0 mt-6 order-2 md:order-1">
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="hidden md:block absolute left-1/2 top-6 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 transform -translate-x-1/2"></div>
                
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-10 md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">5. Adoption & Continuous Improvement</h3>
                    <p className="text-gray-600">
                      Training, change management, and ongoing support to drive user adoption and continuously improve your Salesforce environment.
                    </p>
                  </div>
                  <div className="hidden md:block w-0"></div>
                  <div className="md:w-1/2 pl-10 md:mt-0 mt-6">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CloudSeek for Salesforce Consulting
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unparalleled expertise and proven success in driving Salesforce transformation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-4 text-blue-600">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Salesforce Experts</h3>
                  <p className="text-gray-600">
                    Our team includes Salesforce-certified consultants with deep platform expertise across all clouds and industries.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-4 text-blue-600">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Results-Focused Approach</h3>
                  <p className="text-gray-600">
                    We measure success by your business outcomes, not just technical implementation milestones.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-4 text-blue-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Communication</h3>
                  <p className="text-gray-600">
                    We translate complex technical concepts into clear business language, ensuring alignment at every step.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-4 text-blue-600">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Accelerated Time-to-Value</h3>
                  <p className="text-gray-600">
                    Our proven methodology and industry expertise help you realize business value faster.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-4 text-blue-600">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Best Practice Guidance</h3>
                  <p className="text-gray-600">
                    We ensure your implementation follows Salesforce best practices for security, scalability, and performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="mr-4 text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Change Management Expertise</h3>
                  <p className="text-gray-600">
                    We help your team embrace change through effective training, communication, and adoption strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Client Success Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our Salesforce consulting transformed business operations
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="/images/success-story.jpg" 
                  alt="Success Story" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="text-sm text-blue-600 font-semibold mb-2">HEALTHCARE INDUSTRY</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Regional Healthcare Provider Transforms Patient Experience
                </h3>
                <p className="text-gray-600 mb-6">
                  CloudSeek helped this healthcare provider consolidate disparate systems into a unified Salesforce Health Cloud solution, improving patient engagement and operational efficiency.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-700">360° patient view across all departments</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-700">42% reduction in administrative tasks</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-700">Patient satisfaction scores increased by 35%</p>
                  </div>
                </div>
                <Link 
                  to="/case-studies" 
                  className="inline-flex items-center text-blue-600 font-medium"
                >
                  Read Full Case Study <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonial Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-full p-10 md:p-16">
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
                  CloudSeek's Salesforce consulting team transformed our operations. Their strategic approach and technical expertise helped us achieve outcomes we didn't think were possible.
                </h3>
                <div className="flex items-center">
                  <img 
                    src="/images/client-avatar-3.jpg" 
                    alt="Client" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-white font-bold">Jennifer Williams</p>
                    <p className="text-blue-100">VP of Operations, Global Manufacturing Inc.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Salesforce Experience?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Let's discuss how our Salesforce consulting services can help you maximize ROI and drive business growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium flex items-center justify-center"
            >
              Schedule a Consultation
              <ChevronRight size={16} className="ml-2" />
            </Link>
            <Link 
              to="/case-studies" 
              className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium flex items-center justify-center"
            >
              View Our Success Stories
              <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalesforceConsultingPage; 