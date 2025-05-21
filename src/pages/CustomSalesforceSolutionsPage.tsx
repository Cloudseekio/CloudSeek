import React from 'react';
import { ChevronRight, CheckCircle, Database, Code, Shield, Server, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomSalesforceSolutionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Custom Salesforce Solutions Tailored to Your Business
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Powerful, scalable applications and integrations that extend Salesforce capabilities to meet your unique business requirements.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Discuss Your Requirements
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
              Comprehensive Custom Salesforce Development
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Extend and enhance your Salesforce platform with tailor-made solutions that address your unique business challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Code size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Custom Lightning Components
              </h3>
              <p className="text-gray-600">
                Bespoke UI components that seamlessly integrate with Salesforce Lightning Experience to enhance user productivity.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Database size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Advanced Data Models
              </h3>
              <p className="text-gray-600">
                Custom objects, fields, and relationships designed to support complex business processes and reporting needs.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Layers size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                API Integrations
              </h3>
              <p className="text-gray-600">
                Seamless connections between Salesforce and your existing business systems through custom API integrations.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Apex Development
              </h3>
              <p className="text-gray-600">
                Custom business logic implemented through Apex classes, triggers, and batch processes for enterprise-grade functionality.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Server size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Heroku & Platform Solutions
              </h3>
              <p className="text-gray-600">
                Extend your Salesforce capabilities with custom applications built on Heroku to handle high-volume processing.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Shield size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Security & Compliance
              </h3>
              <p className="text-gray-600">
                Custom security models and compliance solutions to ensure your data is protected while meeting industry regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CloudSeek for Custom Salesforce Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our approach combines technical expertise with deep business understanding to deliver solutions that drive real results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start mb-4">
                <div className="mr-4 text-blue-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Expertise</h3>
                  <p className="text-gray-600">
                    Our team includes Salesforce-certified developers, architects, and consultants with deep platform knowledge.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start mb-4">
                <div className="mr-4 text-blue-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Business-First Approach</h3>
                  <p className="text-gray-600">
                    We focus on understanding your business objectives before writing a single line of code.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start mb-4">
                <div className="mr-4 text-blue-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scalable Solutions</h3>
                  <p className="text-gray-600">
                    Our custom solutions are built to scale with your business, adapting to changing requirements over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-start mb-4">
                <div className="mr-4 text-blue-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Future-Proof Development</h3>
                  <p className="text-gray-600">
                    We follow Salesforce best practices to ensure your custom solutions remain compatible with future platform updates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured methodology that ensures high-quality, on-time delivery of your custom Salesforce solutions
            </p>
          </div>

          <div className="relative">
            {/* Process Timeline */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100"></div>

            {/* Process Steps */}
            <div className="space-y-16">
              <div className="md:flex">
                <div className="md:w-5/12 pr-8 md:text-right">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. Discovery & Requirements</h3>
                  <p className="text-gray-600">
                    We collaborate with your team to understand business objectives, user needs, and technical requirements.
                  </p>
                </div>
                <div className="md:w-2/12"></div>
                <div className="md:w-5/12"></div>
              </div>

              <div className="md:flex">
                <div className="md:w-5/12"></div>
                <div className="md:w-2/12"></div>
                <div className="md:w-5/12 pl-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. Solution Design</h3>
                  <p className="text-gray-600">
                    Our architects create a detailed blueprint for your custom solution, including data models, user flows, and integrations.
                  </p>
                </div>
              </div>

              <div className="md:flex">
                <div className="md:w-5/12 pr-8 md:text-right">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3. Development & Testing</h3>
                  <p className="text-gray-600">
                    Our developers build your solution in sprints with continuous testing to ensure quality and alignment with requirements.
                  </p>
                </div>
                <div className="md:w-2/12"></div>
                <div className="md:w-5/12"></div>
              </div>

              <div className="md:flex">
                <div className="md:w-5/12"></div>
                <div className="md:w-2/12"></div>
                <div className="md:w-5/12 pl-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">4. Deployment & Training</h3>
                  <p className="text-gray-600">
                    We implement your solution using best practices for deployment, along with comprehensive training for your team.
                  </p>
                </div>
              </div>

              <div className="md:flex">
                <div className="md:w-5/12 pr-8 md:text-right">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">5. Ongoing Support & Enhancement</h3>
                  <p className="text-gray-600">
                    We provide continued support and regular enhancements to ensure your solution evolves with your business.
                  </p>
                </div>
                <div className="md:w-2/12"></div>
                <div className="md:w-5/12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Case Study
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our custom Salesforce solutions have transformed businesses
            </p>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="/images/case-study-featured.jpg" 
                  alt="Case Study" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12">
                <div className="text-sm text-blue-600 font-semibold mb-2">FINANCIAL SERVICES</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Global Financial Firm Streamlines Complex Loan Processes
                </h3>
                <p className="text-gray-600 mb-6">
                  Developed a custom loan management system on Salesforce that automated complex workflows, integrated with legacy systems, and provided real-time reporting dashboards.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-700">Reduced loan processing time by 68%</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-700">Increased data accuracy to 99.8%</p>
                  </div>
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-700">Scaled to handle 10,000+ loans per month</p>
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
                  CloudSeek's custom development team built a solution that our internal team said couldn't be done. The result has transformed how we manage customer relationships.
                </h3>
                <div className="flex items-center">
                  <img 
                    src="/images/testimonial-avatar.jpg" 
                    alt="Client" 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-white font-bold">David Rodriguez</p>
                    <p className="text-blue-100">CIO, Enterprise Manufacturing Inc.</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/salesforce-custom-testimonial.jpg" 
                  alt="Custom Salesforce Solution" 
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
            Ready to Transform Your Salesforce Experience?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Let's discuss how our custom Salesforce solutions can help you overcome business challenges and drive growth.
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
              View Our Work
              <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomSalesforceSolutionsPage; 