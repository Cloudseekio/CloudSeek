import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, ShoppingBag, ArrowRight, Mail, Target, Smartphone, Zap } from 'lucide-react';

const RetailMax: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "RetailMax",
    subtitle: "Email Marketing Transformation with Marketing Cloud",
    industry: "Retail",
    challenge: "RetailMax, a multi-category retailer with 75+ stores nationwide and a growing e-commerce presence, struggled with low email engagement and poor campaign performance. Their legacy email marketing system delivered generic, one-size-fits-all messages that failed to resonate with customers. With declining open rates, click-through rates below industry average, and a high unsubscribe rate, RetailMax was unable to leverage their extensive customer data to create personalized experiences. The marketing team was spending excessive time creating campaigns with minimal ROI, while competitors were capturing market share with more targeted communications.",
    solution: "We implemented a comprehensive Salesforce Marketing Cloud solution with advanced personalization capabilities. The solution included:",
    solutionPoints: [
      "Customer data platform integration consolidating purchase history, browsing behavior, and demographic information",
      "AI-powered customer segmentation based on purchase patterns, preferences, and lifecycle stage",
      "Dynamic content blocks that automatically personalized email elements based on individual customer data",
      "Journey Builder implementation with behavioral triggers and real-time engagement paths",
      "Predictive product recommendations using Einstein AI",
      "A/B testing framework to optimize subject lines, send times, and content layouts"
    ],
    results: [
      "165% increase in email engagement rates",
      "78% improvement in click-through rates",
      "42% reduction in unsubscribe rates",
      "52% growth in email-attributed revenue",
      "3.1x higher conversion rate on personalized product recommendations"
    ],
    implementation: "The implementation was completed over a 12-week period, with careful data migration and integration with RetailMax's existing e-commerce platform. We provided comprehensive training for the marketing team and established a Center of Excellence to ensure ongoing optimization.",
    technology: ["Salesforce Marketing Cloud", "Einstein Analytics", "Journey Builder", "Content Builder", "Email Studio", "Mobile Studio", "Audience Studio"],
    clientInfo: {
      name: "RetailMax",
      industry: "Retail",
      location: "Nationwide",
      size: "Mid-size retailer with 75+ stores"
    },
    testimonial: {
      quote: "The Marketing Cloud implementation has revolutionized how we communicate with our customers. We've gone from sending generic batch-and-blast emails to delivering truly personalized experiences that speak to each customer's individual preferences and shopping behavior. The increase in engagement has directly translated to higher sales and customer loyalty.",
      author: "Lisa Chen",
      position: "VP of Digital Marketing, RetailMax",
      avatar: "/images/avatars/lisa-chen.jpg"
    },
    keyMetrics: [
      { label: "Email Engagement", value: "+165%" },
      { label: "Click-Through Rate", value: "+78%" },
      { label: "Unsubscribe Rate", value: "-42%" },
      { label: "Email Revenue", value: "+52%" }
    ]
  };

  // Performance metrics for visualization
  const performanceMetrics = {
    emailEngagement: "w-[100%]", // Using 100% as maximum for display
    clickThroughRate: "w-[78%]",
    unsubscribeReduction: "w-[42%]",
    emailRevenue: "w-[52%]"
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "RetailNXT",
      slug: "retailnxt",
      description: "Customer retention improvement with personalized shopping experiences"
    },
    {
      title: "LuxeHome Furnishings",
      slug: "luxehome-furnishings",
      description: "E-commerce personalization driving 45% increase in average order value"
    }
  ];

  // Email campaign performance table data
  const campaignData = [
    { name: "Before Implementation", openRate: "18%", clickRate: "2.1%", conversionRate: "0.8%", revenue: "$12,400" },
    { name: "After 1 Month", openRate: "24%", clickRate: "3.8%", conversionRate: "1.4%", revenue: "$18,700" },
    { name: "After 3 Months", openRate: "38%", clickRate: "5.2%", conversionRate: "2.1%", revenue: "$27,500" },
    { name: "After 6 Months", openRate: "47%", clickRate: "7.8%", conversionRate: "2.9%", revenue: "$42,800" }
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
              <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-4">Key Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {caseStudy.keyMetrics.map((metric, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">{metric.value}</div>
                      <div className="text-sm text-gray-300">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Main Content - 2/3 width */}
              <div className="md:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <h2>The Challenge</h2>
                  <p>{caseStudy.challenge}</p>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
                    <h3 className="text-lg font-medium text-orange-800 mb-2">Key Challenges</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Generic, one-size-fits-all email campaigns with low engagement</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Inability to leverage customer data for personalized experiences</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">High unsubscribe rates causing erosion of marketing database</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-orange-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Time-consuming campaign creation process with minimal ROI</p>
                      </li>
                    </ul>
                  </div>
                  
                  <h2>Our Solution</h2>
                  <p>We implemented a comprehensive Salesforce Marketing Cloud solution tailored to RetailMax's specific needs and customer base. The solution was designed to unify customer data, enable advanced segmentation, and deliver highly personalized content at scale.</p>
                  
                  <h3>Key Components</h3>
                  <ul>
                    {caseStudy.solutionPoints.map((point, index) => (
                      <li key={index} className="flex items-start mb-4">
                        <div className="flex-shrink-0 mt-1 text-blue-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3">{point}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-blue-50 rounded-lg p-6 my-8">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">Email Campaign Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Campaign Phase</th>
                            <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Open Rate</th>
                            <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Click Rate</th>
                            <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Conversion</th>
                            <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {campaignData.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{row.name}</td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{row.openRate}</td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{row.clickRate}</td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{row.conversionRate}</td>
                              <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{row.revenue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <h2>The Results</h2>
                  <p>The Marketing Cloud implementation transformed RetailMax's email marketing program, delivering substantial improvements in engagement, conversion, and revenue.</p>
                  
                  <div className="space-y-4 my-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 font-medium">Email Engagement</span>
                        <span className="text-blue-600 font-bold">+165%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 font-medium">Click-Through Rate</span>
                        <span className="text-blue-600 font-bold">+78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 font-medium">Email Revenue Growth</span>
                        <span className="text-blue-600 font-bold">+52%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 font-medium">Unsubscribe Rate Reduction</span>
                        <span className="text-blue-600 font-bold">-42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Implementation Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-600 text-white">
                          <Users size={24} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Customer Segmentation</h4>
                        <p className="mt-2 text-gray-600">Created 24 dynamic customer segments based on purchase history, browsing behavior, and lifecycle stage</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-600 text-white">
                          <Mail size={24} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Dynamic Content</h4>
                        <p className="mt-2 text-gray-600">Implemented 35+ content variations that automatically display based on customer preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-600 text-white">
                          <Zap size={24} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Behavioral Triggers</h4>
                        <p className="mt-2 text-gray-600">Set up 12 automated journeys triggered by specific customer actions and milestones</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-blue-600 text-white">
                          <Smartphone size={24} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Cross-Channel Integration</h4>
                        <p className="mt-2 text-gray-600">Connected email campaigns with SMS, push notifications, and website personalization</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar - 1/3 width */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">About the Client</h3>
                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Company</h4>
                      <p className="text-base font-medium text-gray-900">{caseStudy.clientInfo.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                      <p className="text-base font-medium text-gray-900">{caseStudy.clientInfo.industry}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Size</h4>
                      <p className="text-base font-medium text-gray-900">{caseStudy.clientInfo.size}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p className="text-base font-medium text-gray-900">{caseStudy.clientInfo.location}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {caseStudy.technology.map((tech, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start">
                      <Quote size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                      <blockquote className="ml-4">
                        <p className="text-gray-700 italic">{caseStudy.testimonial.quote}</p>
                        <footer className="mt-4">
                          <div className="flex items-center">
                            {caseStudy.testimonial.avatar && (
                              <img 
                                src={caseStudy.testimonial.avatar} 
                                alt={caseStudy.testimonial.author}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{caseStudy.testimonial.author}</p>
                              <p className="text-gray-600 text-sm">{caseStudy.testimonial.position}</p>
                            </div>
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
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
                    <p className="ml-3 text-gray-700">22% increase in customer lifetime value within the first year</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1 text-green-600">
                      <Check size={20} />
                    </div>
                    <p className="ml-3 text-gray-700">Marketing team efficiency improved by 35%, allowing focus on strategy rather than execution</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1 text-green-600">
                      <Check size={20} />
                    </div>
                    <p className="ml-3 text-gray-700">Improved data collection enabled better business decision-making across departments</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1 text-green-600">
                      <Check size={20} />
                    </div>
                    <p className="ml-3 text-gray-700">Established RetailMax as a customer-centric brand, increasing Net Promoter Score by 18 points</p>
                  </li>
                </ul>
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
              Ready to Transform Your Marketing Engagement?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization create personalized customer experiences that drive measurable results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/marketing-cloud" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Marketing Cloud Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RetailMax; 