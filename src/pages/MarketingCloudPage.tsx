import React from 'react';
import { Helmet } from 'react-helmet-async';
import MarketingCloudHeroSection from '../components/MarketingCloudHeroSection';
import { ChevronRight, CheckCircle, Target, Mail, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketingCloudPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Salesforce Marketing Cloud Solutions | CloudSeek</title>
        <meta name="description" content="Personalize every customer journey with Salesforce Marketing Cloud. Create seamless, data-driven experiences across email, mobile, social, and web." />
      </Helmet>
      
      {/* Hero Section with Marketing Cloud Dashboard */}
      <MarketingCloudHeroSection />

      {/* Key Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transform Your Marketing Strategy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Marketing Cloud helps you build and manage customer journeys, deliver personalized content, and measure campaign effectiveness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Target size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Precision Targeting
              </h3>
              <p className="text-gray-600">
                Segment your audience with powerful AI-driven tools that analyze behavior, preferences, and engagement patterns.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <Mail size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Omnichannel Engagement
              </h3>
              <p className="text-gray-600">
                Deliver consistent, personalized messages across email, mobile, social media, web, and advertising channels.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-blue-600 mb-4">
                <LineChart size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Data-Driven Insights
              </h3>
              <p className="text-gray-600">
                Get comprehensive analytics and real-time reporting to optimize campaigns and demonstrate ROI.
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
              Powerful Marketing Cloud Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create personalized, cross-channel customer journeys
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Journey Builder
                </h3>
                <p className="text-gray-600">
                  Craft personalized customer journeys with a powerful drag-and-drop interface that responds to customer actions in real-time.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Studio
                </h3>
                <p className="text-gray-600">
                  Create, test, and deliver personalized email campaigns at scale with advanced automation and segmentation.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mobile Studio
                </h3>
                <p className="text-gray-600">
                  Engage customers with personalized SMS, push notifications, and in-app messaging to enhance mobile experiences.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Social Studio
                </h3>
                <p className="text-gray-600">
                  Listen, publish, and engage with customers across social channels while measuring campaign effectiveness.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Advertising Studio
                </h3>
                <p className="text-gray-600">
                  Create targeted advertising campaigns across major platforms using your CRM data for precise audience targeting.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Interaction Studio
                </h3>
                <p className="text-gray-600">
                  Visualize, track, and manage real-time customer experiences across your touchpoints to personalize interactions.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Datorama
                </h3>
                <p className="text-gray-600">
                  Unify your marketing data from all sources to gain comprehensive insights and optimize performance.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mr-4 text-blue-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Einstein AI
                </h3>
                <p className="text-gray-600">
                  Leverage artificial intelligence to predict customer engagement, optimize send times, and personalize content.
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
                  How RetailMax Increased Email Engagement by 165%
                </h3>
                <p className="text-gray-300 mb-8">
                  Discover how we helped RetailMax implement Marketing Cloud to create personalized shopping experiences, resulting in dramatically improved email metrics and a 37% increase in revenue.
                </p>
                <Link to="/case-studies/retail-max" className="flex items-center text-white font-medium">
                  Read the full case study
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="/images/case-studies/retailnxt.jpg" 
                  alt="RetailMax Case Study" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Builder Showcase Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Create Powerful Customer Journeys
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Journey Builder lets you design and automate personalized customer experiences across all channels, triggered by customer behavior.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Map Customer Touchpoints</h3>
                    <p className="text-gray-600">Design multi-step journeys with an intuitive drag-and-drop interface.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Personalize Every Step</h3>
                    <p className="text-gray-600">Deliver targeted content based on customer data, preferences, and behaviors.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Optimize with Real-Time Data</h3>
                    <p className="text-gray-600">Analyze journey performance and make adjustments to improve results.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">Automate at Scale</h3>
                    <p className="text-gray-600">Reach millions of customers with personalized journeys without manual intervention.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <img 
                src="/images/marketing-cloud-journey.jpg" 
                alt="Journey Builder" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Approach Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Marketing Cloud Implementation Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CloudSeek's proven methodology ensures successful Marketing Cloud deployments that drive measurable business results
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discovery & Strategy</h3>
              <p className="text-gray-600">
                We analyze your marketing objectives, audience, and existing processes to develop a tailored strategy.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Configuration</h3>
              <p className="text-gray-600">
                Our certified experts configure Marketing Cloud to align with your specific business requirements.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Journey Development</h3>
              <p className="text-gray-600">
                We design and build customer journeys, templates, and automations tailored to your audience segments.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Optimization & Support</h3>
              <p className="text-gray-600">
                We provide ongoing support, analytics, and optimization to continuously improve your marketing results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Ecosystem Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img 
                src="/images/marketing-cloud-integrations.jpg" 
                alt="Marketing Cloud Integrations" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Seamless Integration Ecosystem
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Marketing Cloud connects with your entire tech stack to create a unified marketing platform:
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Native integration with Salesforce CRM for complete customer visibility</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Connect with Commerce Cloud to orchestrate personalized shopping experiences</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Integrate with Service Cloud to align marketing and customer service</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Connect hundreds of third-party tools via APIs and pre-built connectors</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 text-blue-600">
                    <CheckCircle size={20} />
                  </div>
                  <p className="ml-3 text-gray-600">Synchronize data with your existing data warehouse or CDP</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to revolutionize your marketing strategy?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Let our experts guide you through the transformation. Discover how Marketing Cloud can be tailored 
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

export default MarketingCloudPage; 