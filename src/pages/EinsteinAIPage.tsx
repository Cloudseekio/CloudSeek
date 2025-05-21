import React from 'react';
import { ChevronRight, CheckCircle, Brain, Zap, Target, LineChart, Bot, Shield, Code, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import EinsteinAIHeroSection from '../components/EinsteinAIHeroSection';

const EinsteinAIPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Einstein AI Solutions | CloudSeek</title>
        <meta name="description" content="Transform your business with Einstein AI. Harness the power of artificial intelligence to drive smarter decisions and deliver personalized experiences at scale." />
      </Helmet>

      {/* Hero Section with Einstein AI Dashboard */}
      <EinsteinAIHeroSection />

      {/* Key Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Innovation for Every Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Einstein AI brings intelligent automation and insights to every Salesforce user, regardless of technical expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Zap size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Boost Productivity
              </h3>
              <p className="text-gray-600">
                Automate routine tasks, generate content, and receive smart recommendations that save hours of manual work.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Brain size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unlock Intelligent Insights
              </h3>
              <p className="text-gray-600">
                Uncover patterns in your data, predict outcomes, and make informed decisions with AI-powered analytics.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Target size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Personalize Experiences
              </h3>
              <p className="text-gray-600">
                Deliver tailored recommendations, content, and interactions that resonate with each customer's unique needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Einstein Capabilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Einstein AI Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI features built directly into your Salesforce applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein for Sales
                </h3>
                <p className="text-gray-600">
                  Prioritize leads, forecast opportunities, and get next-best-action recommendations to close more deals.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein for Service
                </h3>
                <p className="text-gray-600">
                  Automatically classify cases, recommend solutions, and power intelligent chatbots for faster resolutions.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein for Marketing
                </h3>
                <p className="text-gray-600">
                  Optimize campaign timing, personalize content, and predict customer engagement to drive conversion.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein for Commerce
                </h3>
                <p className="text-gray-600">
                  Deliver personalized product recommendations and search results that increase average order value.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein Generative AI
                </h3>
                <p className="text-gray-600">
                  Generate human-like text for emails, summaries, content creation, and more across all Salesforce clouds.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein Vision & Language
                </h3>
                <p className="text-gray-600">
                  Add image recognition and natural language processing capabilities to your apps with pre-built APIs.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein Analytics
                </h3>
                <p className="text-gray-600">
                  Create intelligent dashboards with AI-powered insights and recommendations built in.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein Trust
                </h3>
                <p className="text-gray-600">
                  Leverage AI responsibly with built-in governance, transparency, and privacy controls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generative AI Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Einstein GPT: The World's First Generative AI for CRM
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Einstein GPT combines Salesforce data with generative AI technology to transform how businesses interact with their customers and information.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Conversational Interfaces</h3>
                    <p className="text-gray-600">Natural language interactions to query data, get insights, and take action.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Content Generation</h3>
                    <p className="text-gray-600">Automatically create personalized emails, meeting summaries, marketing copy, and more.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Code size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Code Generation</h3>
                    <p className="text-gray-600">Create Apex code, Lightning components, and automation flows with natural language prompts.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Shield size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Enterprise-Grade Security</h3>
                    <p className="text-gray-600">Built with robust security and privacy controls to protect your sensitive data.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="/images/einstein-gpt-demo.jpg" 
                alt="Einstein GPT Demo" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Einstein AI Across Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How leading organizations are leveraging Einstein AI to transform their operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <LineChart size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Services</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Predict customer churn and take proactive retention actions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Automate fraud detection and risk assessment</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Personalize financial product recommendations</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <LineChart size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare & Life Sciences</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Optimize patient engagement and care journeys</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Predict patient outcomes and treatment effectiveness</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Accelerate research and development processes</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <LineChart size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Retail & Consumer Goods</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Deliver hyper-personalized shopping experiences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Optimize inventory and supply chain management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <span>Predict and influence customer purchasing behavior</span>
                </li>
              </ul>
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
                  SUCCESS STORY
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  How GlobalTech Achieved 40% Higher Conversion Rates with Einstein AI
                </h3>
                <p className="text-gray-300 mb-8">
                  Learn how our implementation of Einstein AI helped GlobalTech predict customer needs, automate service responses, and personalize marketing—resulting in dramatic improvements in efficiency and revenue.
                </p>
                <Link to="/case-studies/global-tech" className="flex items-center text-white font-medium">
                  Read the full story
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/einstein-case-study.jpg" 
                  alt="GlobalTech Case Study" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Approach Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Einstein AI Implementation Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CloudSeek's structured methodology ensures you maximize the value of Einstein AI across your organization
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="h-2 bg-blue-600 absolute top-9 left-1/2 transform -translate-x-1/2 w-full md:w-full md:left-full md:-translate-x-1/2 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Readiness Assessment</h3>
                <p className="text-gray-600">
                  We evaluate your data quality, business processes, and use cases to create an AI roadmap.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-2 bg-blue-600 absolute top-9 left-1/2 transform -translate-x-1/2 w-full md:w-full md:left-full md:-translate-x-1/2 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Configuration & Training</h3>
                <p className="text-gray-600">
                  We configure Einstein features and train models with your data for maximum accuracy.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-2 bg-blue-600 absolute top-9 left-1/2 transform -translate-x-1/2 w-full md:w-full md:left-full md:-translate-x-1/2 z-0"></div>
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integration & Workflow Design</h3>
                <p className="text-gray-600">
                  We integrate Einstein AI into your business processes for maximum impact and adoption.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Continuous Optimization</h3>
                <p className="text-gray-600">
                  We monitor AI performance and continuously refine models to deliver increasing value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Unlock the Power of AI?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Let our Einstein AI experts help you identify high-impact use cases and implement intelligent solutions that drive measurable business results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium">
              Schedule a Demo
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default EinsteinAIPage; 