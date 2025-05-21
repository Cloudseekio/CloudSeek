import React from 'react';
import { ChevronRight, CheckCircle, BarChart3, Mail, Clock, Users, Zap, LineChart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PardotHeroSection from '../components/PardotHeroSection';

const PardotPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Pardot Marketing Automation | CloudSeek</title>
        <meta name="description" content="Accelerate your B2B marketing with Pardot, the powerful automation platform that drives pipeline growth and helps close more deals." />
      </Helmet>

      {/* Hero Section with Pardot Dashboard */}
      <PardotHeroSection />
      
      {/* Rest of the Pardot page content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Drive Growth with Intelligent B2B Marketing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pardot empowers marketers to create meaningful connections, generate high-quality leads, and accelerate pipeline growth.
            </p>
          </div>
          
          {/* Key Benefits Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Transform Your B2B Marketing Strategy
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Pardot empowers marketing and sales teams to work together more effectively and drive better business outcomes
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-4">
                    <Target size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Qualify Leads Faster
                  </h3>
                  <p className="text-gray-600">
                    Identify high-value prospects with intelligent lead scoring and grading that prioritizes your sales pipeline.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-4">
                    <Zap size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Increase Marketing Efficiency
                  </h3>
                  <p className="text-gray-600">
                    Automate repetitive tasks and create sophisticated marketing journeys that nurture leads at scale.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-4">
                    <LineChart size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Measure Marketing ROI
                  </h3>
                  <p className="text-gray-600">
                    Track campaign performance with advanced analytics that demonstrate the true impact of your marketing efforts.
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
                  Powerful Pardot Features
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to attract, engage, and convert prospects through personalized B2B marketing
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Lead Generation
                    </h3>
                    <p className="text-gray-600">
                      Create landing pages, forms, and progressive profiling to capture qualified leads from your website.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Email Marketing
                    </h3>
                    <p className="text-gray-600">
                      Build dynamic email templates and automate personalized communications that drive engagement.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Lead Scoring & Grading
                    </h3>
                    <p className="text-gray-600">
                      Prioritize leads based on engagement (scoring) and fit (grading) to focus on your best opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Marketing Automation
                    </h3>
                    <p className="text-gray-600">
                      Create sophisticated engagement programs that automatically nurture prospects through the buyer's journey.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Sales Alignment
                    </h3>
                    <p className="text-gray-600">
                      Seamlessly connect marketing and sales with real-time alerts, prospect insights, and CRM integration.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Account-Based Marketing
                    </h3>
                    <p className="text-gray-600">
                      Tailor campaigns to target high-value accounts and coordinate personalized outreach across departments.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      ROI Reporting & Analytics
                    </h3>
                    <p className="text-gray-600">
                      Measure campaign effectiveness with customizable dashboards and closed-loop reporting.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4 text-blue-600">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Einstein AI Integration
                    </h3>
                    <p className="text-gray-600">
                      Leverage AI-powered insights to optimize campaigns, predict conversion likelihood, and personalize content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Marketing Automation Workflow Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:gap-12">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Streamline Your Marketing Workflows
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Pardot's intuitive automation tools help you create sophisticated marketing journeys without complex technical setup.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Capture Leads</h3>
                        <p className="text-gray-600">Create high-converting forms and landing pages to gather prospect information.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Score & Grade</h3>
                        <p className="text-gray-600">Automatically evaluate leads based on engagement and demographic fit.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Nurture Prospects</h3>
                        <p className="text-gray-600">Develop personalized drip campaigns that move leads through your funnel.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        4
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-gray-900">Qualify & Hand Off</h3>
                        <p className="text-gray-600">Alert sales when leads are ready, with complete visibility into marketing interactions.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <img 
                    src="/images/pardot-workflow.jpg" 
                    alt="Pardot Automation Workflow" 
                    className="rounded-lg shadow-lg"
                  />
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
                      How TechSolutions Increased Qualified Leads by 215%
                    </h3>
                    <p className="text-gray-300 mb-8">
                      Learn how our Pardot implementation helped TechSolutions automate their lead qualification process, reducing sales cycle time and dramatically increasing conversion rates.
                    </p>
                    <Link to="/case-studies/tech-solutions" className="flex items-center text-white font-medium">
                      Read the full case study
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="md:w-1/2">
                    <img 
                      src="/images/pardot-case-study.jpg" 
                      alt="TechSolutions Case Study" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Approach Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Our Pardot Implementation Approach
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  CloudSeek's proven methodology ensures successful Pardot deployments that align with your business goals
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                  <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing Assessment</h3>
                  <p className="text-gray-600">
                    We evaluate your current processes, goals, and challenges to develop a tailored strategy.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                  <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Configuration</h3>
                  <p className="text-gray-600">
                    Our certified experts set up Pardot to align with your sales process and marketing objectives.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                  <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Asset Development</h3>
                  <p className="text-gray-600">
                    We create templates, automation rules, and scoring models tailored to your target audience.
                  </p>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                  <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Optimization & Support</h3>
                  <p className="text-gray-600">
                    We provide ongoing guidance to continuously improve your marketing performance and ROI.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Accelerate Your B2B Marketing?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
                Let our Pardot experts help you build a powerful marketing automation engine that drives qualified leads and revenue growth.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium">
                  Request a Demo
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                  Speak to an Expert
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default PardotPage; 