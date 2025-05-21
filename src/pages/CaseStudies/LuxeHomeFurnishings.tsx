import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, ShoppingBag, ArrowRight, Award, Zap, Target, Heart } from 'lucide-react';

const LuxeHomeFurnishings: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "LuxeHome Furnishings",
    subtitle: "E-commerce Personalization Strategy",
    industry: "Retail",
    challenge: "LuxeHome Furnishings, a premium home goods retailer with both online and physical stores, was struggling with low conversion rates and high cart abandonment despite high website traffic. Their generic shopping experience failed to resonate with diverse customer segments, and they lacked the ability to effectively leverage customer data for personalized marketing and product recommendations.",
    solution: "We implemented a comprehensive Salesforce Commerce Cloud and Marketing Cloud solution with AI-driven personalization capabilities. The solution included:",
    solutionPoints: [
      "Einstein-powered product recommendations based on browsing history, purchase patterns, and similar customer preferences",
      "Dynamic content personalization for homepage, category pages, and marketing campaigns",
      "Customer segmentation with tailored email marketing journeys",
      "Unified customer profiles combining online behavior, in-store purchases, and customer service interactions",
      "AI-powered search that adapts to individual user preferences and trending products"
    ],
    results: [
      "42% increase in conversion rate within 6 months",
      "38% reduction in cart abandonment",
      "27% higher average order value",
      "54% improvement in email campaign engagement",
      "Annual revenue growth of 31% compared to previous year"
    ],
    implementation: "The implementation was completed in a phased approach over 5 months, starting with customer data unification, followed by product recommendation engines, and finally personalized marketing automation. We provided comprehensive training for the marketing and merchandising teams to maximize the platform's capabilities.",
    technology: ["Salesforce Commerce Cloud", "Marketing Cloud", "Einstein Analytics", "MuleSoft Integration", "Customer Data Platform", "Journey Builder"],
    clientInfo: {
      name: "LuxeHome Furnishings",
      location: "Headquartered in Chicago with 15 showrooms across the United States",
      size: "250+ employees, annual revenue of $85M+",
      founded: "2007",
      focus: "Premium home furnishings, décor, and design services"
    },
    testimonial: {
      quote: "The personalization capabilities CloudSeek implemented have transformed our digital shopping experience. We're now able to deliver the same level of personalized attention online that we pride ourselves on in our showrooms. The results speak for themselves – higher conversion, larger orders, and most importantly, customers who feel understood and valued.",
      author: "Alexandra Reynolds",
      position: "Chief Digital Officer, LuxeHome Furnishings",
      avatar: "/images/avatars/alexandra-reynolds.jpg"
    },
    keyMetrics: [
      { label: "Conversion Rate Increase", value: "+42%" },
      { label: "Average Order Value", value: "+27%" },
      { label: "Email Engagement", value: "+54%" },
      { label: "Annual Revenue Growth", value: "+31%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "RetailNXT",
      slug: "retailnxt-customer-retention",
      description: "Customer retention strategy for fashion retailer"
    },
    {
      title: "Luxe Properties Group",
      slug: "luxe-properties",
      description: "Digital transformation for luxury real estate brokerage"
    }
  ];

  // Performance metrics for visualization
  const performanceMetrics = {
    beforeAfterMetrics: [
      { label: "Conversion Rate", before: "2.1%", after: "3.5%" },
      { label: "Cart Abandonment", before: "72%", after: "45%" },
      { label: "Avg. Order Value", before: "$185", after: "$235" },
      { label: "Return Customer Rate", before: "28%", after: "41%" }
    ],
    channelEffectiveness: {
      email: "w-[54%]",
      onsite: "w-[42%]",
      mobilePush: "w-[35%]",
      socialAds: "w-[28%]"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-900 py-20">
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
              <p className="text-2xl text-blue-100 mb-8">
                {caseStudy.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                {caseStudy.technology.slice(0, 3).map((tech, index) => (
                  <span key={index} className="bg-gray-800 text-gray-100 text-xs font-medium px-2.5 py-1 rounded">
                    {tech}
                  </span>
                ))}
                {caseStudy.technology.length > 3 && (
                  <span className="bg-gray-800 text-gray-100 text-xs font-medium px-2.5 py-1 rounded">
                    +{caseStudy.technology.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Overview Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenge</h2>
                <p className="text-gray-700 mb-8">{caseStudy.challenge}</p>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <div className="flex items-start">
                    <div className="mr-4">
                      <Quote size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="italic text-gray-700 mb-4">
                        {caseStudy.testimonial.quote}
                      </p>
                      <p className="font-medium text-gray-900">{caseStudy.testimonial.author}</p>
                      <p className="text-gray-500">{caseStudy.testimonial.position}</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Solution</h2>
                <p className="text-gray-700 mb-4">{caseStudy.solution}</p>
                <ul className="space-y-3 mb-8">
                  {caseStudy.solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1 bg-blue-500 text-white p-1 rounded-full flex items-center justify-center">
                        <Check size={12} />
                      </span>
                      <p className="text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="bg-gray-50 p-8 rounded-lg mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Key Results</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {caseStudy.keyMetrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <p className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</p>
                        <p className="text-sm text-gray-600">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Improvement</h3>
                <div className="space-y-6 mb-8">
                  {performanceMetrics.beforeAfterMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{metric.label}</span>
                        <div>
                          <span className="text-red-500 line-through mr-2">{metric.before}</span>
                          <span className="text-green-600 font-medium">{metric.after}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About {caseStudy.clientInfo.name}</h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <ShoppingBag size={20} className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{caseStudy.clientInfo.focus}</span>
                    </li>
                    <li className="flex">
                      <Users size={20} className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{caseStudy.clientInfo.size}</span>
                    </li>
                    <li className="flex">
                      <Clock size={20} className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">Founded in {caseStudy.clientInfo.founded}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Detailed Results Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Implementation Strategy</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Data Unification</h3>
                <p className="text-gray-600">
                  Created a unified customer profile across online, in-store, and service interactions for a complete view of customer preferences and behaviors.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personalization Engine</h3>
                <p className="text-gray-600">
                  Implemented Einstein-powered recommendation algorithms and dynamic content personalization to deliver relevant products and content.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Zap size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Journeys</h3>
                <p className="text-gray-600">
                  Designed personalized marketing journeys based on customer behavior, preferences, and lifecycle stage to nurture relationships across channels.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">Channel Effectiveness</h3>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-16">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Email Campaigns</span>
                    <span className="text-blue-600 font-medium">54%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.channelEffectiveness.email}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Onsite Personalization</span>
                    <span className="text-blue-600 font-medium">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.channelEffectiveness.onsite}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Mobile Push Notifications</span>
                    <span className="text-blue-600 font-medium">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.channelEffectiveness.mobilePush}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Social Ad Targeting</span>
                    <span className="text-blue-600 font-medium">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.channelEffectiveness.socialAds}`}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Technology Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {caseStudy.technology.map((tech, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Heart size={16} className="text-blue-600" />
                    </div>
                    <span className="text-gray-800">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Related Case Studies</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {relatedCaseStudies.map((relatedCase, index) => (
                <Link 
                  key={index} 
                  to={`/case-studies/${relatedCase.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow p-6 flex flex-col"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{relatedCase.title}</h3>
                  <p className="text-gray-600 mb-4">{relatedCase.description}</p>
                  <span className="text-blue-600 font-medium mt-auto flex items-center">
                    Read case study <ArrowRight size={16} className="ml-2" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Personalize Your E-commerce Experience?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your retail business implement personalization strategies that drive growth and customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/commerce-cloud" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore E-commerce Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LuxeHomeFurnishings; 