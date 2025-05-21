import React from 'react';
import { ChevronRight, CheckCircle, BarChart3, Zap, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SalesCloudHeroSection from '../components/SalesCloudHeroSection';

const SalesCloudPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Salesforce Sales Cloud Solutions | CloudSeek</title>
        <meta name="description" content="Transform your sales process with Salesforce Sales Cloud. Streamline operations, boost rep productivity, and close more deals with the world's #1 sales platform." />
      </Helmet>

      {/* Hero Section with Sales Cloud Dashboard */}
      <SalesCloudHeroSection />
      
      {/* Rest of the Sales Cloud page content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elevate Your Sales Performance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Give your sales team the tools they need to identify the best leads, close deals faster, and grow customer relationships.
            </p>
          </div>
          
          {/* Key Benefits Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Key Benefits of Sales Cloud
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover how Sales Cloud can transform your sales operation and drive sustainable growth
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-4">
                    <BarChart3 size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Increase Revenue
                  </h3>
                  <p className="text-gray-600">
                    Boost sales performance with AI-powered insights, streamlined processes, and enhanced visibility into your pipeline.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-4">
                    <Zap size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Accelerate Sales Cycles
                  </h3>
                  <p className="text-gray-600">
                    Close deals faster with automated workflows, guided selling, and real-time collaboration tools.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-4">
                    <Brain size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI-Powered Insights
                  </h3>
                  <p className="text-gray-600">
                    Leverage Einstein AI to predict outcomes, recommend next steps, and identify opportunities with the highest likelihood to close.
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
                  Powerful Features for Modern Sales Teams
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to manage your entire sales cycle in one platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Account & Contact Management
                    </h3>
                    <p className="text-gray-600">
                      Get a complete view of your customers including activity history, key contacts, customer communications, and internal discussions.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Opportunity Management
                    </h3>
                    <p className="text-gray-600">
                      Track your deals from start to finish, get coaching on next steps, and stay on top of your quota.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Einstein AI Forecasting
                    </h3>
                    <p className="text-gray-600">
                      Get accurate sales predictions with AI-powered forecasting that helps you identify risks and opportunities in real time.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Mobile Selling
                    </h3>
                    <p className="text-gray-600">
                      Run your business from your phone with real-time updates, task management, and deal approvals from anywhere.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Reports & Dashboards
                    </h3>
                    <p className="text-gray-600">
                      Get real-time insights with customizable reports and dashboards to track performance metrics that matter to your business.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      CPQ & Billing
                    </h3>
                    <p className="text-gray-600">
                      Generate accurate quotes with the right products, pricing, and discounts, then automatically convert them to orders and invoices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Case Study Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  See Sales Cloud in Action
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Discover how our clients have transformed their sales operations with Salesforce Sales Cloud
                </p>
              </div>
              
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="md:flex">
                  <div className="md:w-2/5 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-3">TechVision</h3>
                    <p className="text-lg mb-4">How TechVision Increased Sales by 42% with Sales Cloud</p>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <CheckCircle className="text-green-300 mr-2 h-5 w-5 mt-0.5" />
                        <span>42% increase in overall sales</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="text-green-300 mr-2 h-5 w-5 mt-0.5" />
                        <span>68% improvement in lead response time</span>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="text-green-300 mr-2 h-5 w-5 mt-0.5" />
                        <span>57% reduction in sales cycle length</span>
                      </div>
                    </div>
                    <Link 
                      to="/case-studies/tech-vision" 
                      className="mt-6 inline-flex items-center text-white font-medium hover:underline group"
                    >
                      Read the full case study <ArrowRight size={16} className="ml-2 group-hover:ml-3 transition-all" />
                    </Link>
                  </div>
                  <div className="md:w-3/5 p-8">
                    <blockquote className="text-gray-700 italic mb-6">
                      "CloudSeek's Sales Cloud implementation transformed our entire sales organization. The visibility we now have into our pipeline has dramatically improved our forecasting accuracy."
                    </blockquote>
                    <p className="font-semibold text-gray-900">— Michael Reeves, VP of Sales at TechVision</p>
                    <div className="mt-6 flex justify-end">
                      <Link 
                        to="/case-studies/tech-vision" 
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                      >
                        Explore detailed results <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Approach Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:gap-12">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Our Approach to Sales Cloud Implementation
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    At CloudSeek, we bring years of expertise in delivering successful Sales Cloud implementations that drive measurable business results.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Discovery & Strategy</h3>
                        <p className="text-gray-600">We analyze your current processes and design a solution tailored to your needs.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Implementation & Configuration</h3>
                        <p className="text-gray-600">Our certified experts configure Sales Cloud to match your unique business processes.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Training & Adoption</h3>
                        <p className="text-gray-600">We ensure your team is fully equipped to maximize the value of Sales Cloud.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Ongoing Support & Optimization</h3>
                        <p className="text-gray-600">We provide continuous support to ensure long-term success and ROI.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <img 
                    src="/images/case-studies/tech-vision.jpg" 
                    alt="Our Approach" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-50 py-16 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to revolutionize your sales process?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                Let our experts guide you through the transformation. Discover how Sales Cloud can be tailored 
                to your specific business needs and drive measurable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition"
                >
                  Schedule a Demo <ArrowRight className="ml-2 h-5 w-5" />
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
      </section>
    </>
  );
};

export default SalesCloudPage; 