import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Brain, ArrowRight, Award, Zap, Target, Globe, Database, LineChart, Bot } from 'lucide-react';

const GlobalTech: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "GlobalTech",
    subtitle: "Conversion Rate Optimization with Einstein AI",
    industry: "Technology",
    challenge: "GlobalTech, an international enterprise software provider with products used by over 2 million users worldwide, struggled with predicting customer needs and personalizing their digital experience. Despite having substantial customer data, they couldn't effectively leverage it to enhance conversion rates or improve customer interactions. Their marketing and sales teams were making decisions based on general trends rather than specific customer insights, resulting in generic customer journeys that failed to address individual needs. With increasing competition in the enterprise software market, they needed a solution that could help them deliver more personalized experiences at scale.",
    solution: "We implemented a comprehensive Einstein AI solution integrated with their existing Salesforce ecosystem. The solution included:",
    solutionPoints: [
      "Einstein Prediction Builder to forecast customer needs and likelihood to convert",
      "Einstein Next Best Action to recommend optimal engagement strategies for each customer",
      "Einstein Bot customized for intelligent product recommendations and support",
      "Einstein Analytics dashboards for visualizing customer behavior patterns",
      "Einstein Vision for analyzing customer engagement with visual content",
      "Custom AI models trained on GlobalTech's specific customer data and industry patterns"
    ],
    results: [
      "40% increase in conversion rates across digital channels",
      "53% improvement in customer engagement metrics",
      "68% reduction in time to identify high-value opportunities",
      "35% decrease in customer acquisition costs",
      "27% increase in average deal size"
    ],
    implementation: "The implementation was completed over a 14-week period, with careful integration into GlobalTech's existing Salesforce architecture. We conducted extensive training for sales, marketing, and customer success teams to ensure widespread adoption of the AI-driven insights and recommendations.",
    technology: ["Salesforce Einstein AI", "Einstein Prediction Builder", "Einstein Next Best Action", "Einstein Analytics", "Einstein Bot", "Einstein Vision", "Custom ML Models"],
    clientInfo: {
      name: "GlobalTech",
      industry: "Enterprise Software",
      location: "Global operations across 15 countries",
      size: "Enterprise company with 3,500+ employees"
    },
    testimonial: {
      quote: "The Einstein AI implementation has transformed how we understand and interact with our customers. We're now able to predict customer needs with remarkable accuracy and deliver truly personalized experiences at every touchpoint. The impact on our conversion rates has exceeded our expectations, and we're seeing substantial improvements across all our key performance indicators.",
      author: "Elena Rodriguez",
      position: "Chief Digital Officer, GlobalTech",
      avatar: "/images/avatars/elena-rodriguez.jpg"
    },
    keyMetrics: [
      { label: "Conversion Rate", value: "+40%" },
      { label: "Customer Engagement", value: "+53%" },
      { label: "Opportunity Identification", value: "-68%" },
      { label: "Acquisition Cost", value: "-35%" }
    ]
  };

  // Performance metrics for visualization
  const performanceMetrics = {
    conversionRate: "w-[80%]", // Using 100% as maximum for display
    customerEngagement: "w-[90%]",
    opportunityIdentification: "w-[68%]",
    acquisitionCost: "w-[70%]"
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "TechVision",
      slug: "tech-vision",
      description: "Sales Process Transformation with Sales Cloud"
    },
    {
      title: "TechSolutions",
      slug: "tech-solutions",
      description: "Lead Qualification Transformation with Pardot"
    }
  ];

  // AI implementation insights
  const aiImplementationStages = [
    {
      title: "Discovery & Data Analysis",
      description: "Comprehensive analysis of customer data across touchpoints to identify patterns and optimization opportunities",
      timeframe: "Weeks 1-3"
    },
    {
      title: "AI Model Design & Training",
      description: "Development of custom Einstein models tailored to GlobalTech's specific business processes and customer segments",
      timeframe: "Weeks 4-7"
    },
    {
      title: "Integration & Testing",
      description: "Seamless integration with existing systems and rigorous testing to ensure accuracy and performance",
      timeframe: "Weeks 8-10"
    },
    {
      title: "User Training & Adoption",
      description: "Comprehensive training program to ensure teams could effectively leverage AI insights in daily operations",
      timeframe: "Weeks 11-12"
    },
    {
      title: "Optimization & Refinement",
      description: "Ongoing refinement of AI models based on real-world performance and evolving business needs",
      timeframe: "Weeks 13-14"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-4">
              <Link to="/case-studies" className="inline-flex items-center text-blue-300 hover:text-blue-100">
                <ChevronLeft size={16} className="mr-1" />
                Back to Case Studies
              </Link>
            </div>
            <div className="md:w-2/3">
              <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-md mb-4 inline-block">
                {caseStudy.industry}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                {caseStudy.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                {caseStudy.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                {caseStudy.results.map((result, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-900/50 text-blue-100 px-3 py-1 rounded-full text-sm font-medium border border-blue-700/50"
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Sidebar - Client Info */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Client Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{caseStudy.clientInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{caseStudy.clientInfo.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">{caseStudy.clientInfo.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{caseStudy.clientInfo.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Highlights</h3>
                  <div className="space-y-4">
                    {caseStudy.keyMetrics.map((metric, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{metric.label}</span>
                          <span className="font-bold text-blue-600">{metric.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`bg-blue-600 h-2.5 rounded-full ${
                            index === 0 ? performanceMetrics.conversionRate :
                            index === 1 ? performanceMetrics.customerEngagement :
                            index === 2 ? performanceMetrics.opportunityIdentification :
                            performanceMetrics.acquisitionCost
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Challenge */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
                  <p className="text-gray-700 mb-6">{caseStudy.challenge}</p>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                    <h3 className="text-lg font-bold text-orange-800 mb-2">Key Challenges Faced</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Inability to predict customer needs and behaviors with precision</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Generic customer journeys that resulted in low engagement and conversion rates</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Underutilized customer data stored across disparate systems</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Manual processes for identifying high-value opportunities</p>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Solution */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
                  <p className="text-gray-700 mb-6">{caseStudy.solution}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {caseStudy.solutionPoints.map((point, index) => (
                      <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                        <div className="flex-shrink-0 text-blue-600">
                          <Brain size={24} />
                        </div>
                        <p className="ml-3 text-gray-700">{point}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Implementation Journey</h3>
                    <div className="relative">
                      {/* Timeline */}
                      <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200"></div>
                      <div className="space-y-6">
                        {aiImplementationStages.map((stage, index) => (
                          <div key={index} className="relative pl-10">
                            <div className="absolute left-0 top-1.5 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{stage.title}</h4>
                              <p className="text-sm text-blue-600 mb-1">{stage.timeframe}</p>
                              <p className="text-gray-700">{stage.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Technology Stack</h3>
                    <div className="flex flex-wrap gap-3">
                      {caseStudy.technology.map((tech, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Results */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">The Results</h2>
                  <p className="text-gray-700 mb-6">
                    The implementation of Einstein AI transformed GlobalTech's ability to understand, predict, and respond to customer needs, resulting in dramatic improvements across key performance indicators.
                  </p>
                  
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-bold text-gray-900">Metric</th>
                          <th className="py-3 px-4 text-left text-sm font-bold text-gray-900">Before</th>
                          <th className="py-3 px-4 text-left text-sm font-bold text-gray-900">After</th>
                          <th className="py-3 px-4 text-left text-sm font-bold text-gray-900">Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-900">Conversion Rate</td>
                          <td className="py-3 px-4 text-sm text-gray-700">12.5%</td>
                          <td className="py-3 px-4 text-sm text-gray-700">17.5%</td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">+40%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-900">Avg. Customer Engagement</td>
                          <td className="py-3 px-4 text-sm text-gray-700">4.2/10</td>
                          <td className="py-3 px-4 text-sm text-gray-700">6.4/10</td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">+53%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-900">Time to Identify Opportunities</td>
                          <td className="py-3 px-4 text-sm text-gray-700">12.5 days</td>
                          <td className="py-3 px-4 text-sm text-gray-700">4 days</td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">-68%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-900">Customer Acquisition Cost</td>
                          <td className="py-3 px-4 text-sm text-gray-700">$2,800</td>
                          <td className="py-3 px-4 text-sm text-gray-700">$1,820</td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">-35%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-900">Average Deal Size</td>
                          <td className="py-3 px-4 text-sm text-gray-700">$42,000</td>
                          <td className="py-3 px-4 text-sm text-gray-700">$53,340</td>
                          <td className="py-3 px-4 text-sm font-medium text-green-600">+27%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="mb-12">
                  <div className="bg-blue-50 p-8 rounded-lg relative">
                    <div className="text-blue-200 absolute top-4 left-4">
                      <Quote size={48} />
                    </div>
                    <blockquote className="relative z-10">
                      <p className="text-xl text-gray-800 italic mb-6 pl-8">
                        {caseStudy.testimonial.quote}
                      </p>
                      <div className="flex items-center pl-8">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img 
                            src={caseStudy.testimonial.avatar} 
                            alt={caseStudy.testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{caseStudy.testimonial.author}</p>
                          <p className="text-gray-600">{caseStudy.testimonial.position}</p>
                        </div>
                      </div>
                    </blockquote>
                  </div>
                </div>
                
                <div className="mt-16">
                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-lg font-bold text-green-800 mb-3">Long-Term Business Impact</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Created a data-driven culture with AI insights informing strategic decisions across departments</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Enabled proactive customer engagement that anticipates needs before they're explicitly expressed</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Established competitive advantage through personalized experiences that competitors struggle to match</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">AI models continue to improve over time as they learn from more customer interactions</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Case Studies */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Related Case Studies</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedCaseStudies.map((relatedCase, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{relatedCase.title}</h3>
                    <p className="text-gray-600 mb-4">{relatedCase.description}</p>
                    <Link 
                      to={`/case-studies/${relatedCase.slug}`}
                      className="text-blue-600 font-medium flex items-center hover:text-blue-700"
                    >
                      Read case study <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how Einstein AI can help your organization predict customer needs and deliver personalized experiences that drive conversion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/einstein-ai" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Einstein AI Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GlobalTech; 