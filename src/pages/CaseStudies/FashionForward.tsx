import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, ShoppingBag, ArrowRight, Award, Smartphone, RefreshCcw, Truck, Tag } from 'lucide-react';

const FashionForward: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "FashionForward",
    subtitle: "Omnichannel Retail Transformation",
    industry: "Retail",
    challenge: "FashionForward, a premium fashion retailer with over 50 stores nationwide and a growing e-commerce presence, struggled with disconnected customer experiences across channels. Their online and in-store systems operated in silos, leading to inventory discrepancies, inconsistent pricing, fragmented customer data, and lost sales opportunities. As consumer shopping habits rapidly evolved toward expecting seamless cross-channel experiences, FashionForward needed a comprehensive omnichannel strategy to remain competitive.",
    solution: "We implemented a comprehensive Salesforce Commerce Cloud solution that unified all sales channels and customer touchpoints. The solution included:",
    solutionPoints: [
      "Unified Commerce Cloud platform with real-time inventory visibility across all channels",
      "Seamless customer profile integration with personalized shopping experiences",
      "Mobile-first website redesign with in-store mode for associates",
      "Buy online, pick up in store (BOPIS) and ship-from-store capabilities",
      "AI-powered product recommendations and personalized marketing journeys"
    ],
    results: [
      "48% increase in cross-channel conversion rate",
      "35% growth in average customer lifetime value",
      "53% improvement in inventory turnover",
      "27% reduction in fulfillment costs",
      "42% increase in mobile revenue"
    ],
    implementation: "The implementation was conducted in four phases over 6 months, starting with a centralized data foundation, followed by e-commerce platform migration, in-store systems integration, and finally omnichannel fulfillment capabilities. Throughout the process, we conducted regular training sessions for store associates and digital teams to ensure seamless adoption of the new technology.",
    technology: ["Salesforce Commerce Cloud", "Marketing Cloud", "Service Cloud", "Einstein Analytics", "MuleSoft Integration", "Mobile App SDK", "Inventory Management System"],
    clientInfo: {
      name: "FashionForward",
      location: "Headquartered in New York with 50+ retail locations across the United States",
      size: "800+ employees, over 1.5 million active customers",
      founded: "2005",
      focus: "Contemporary fashion apparel and accessories for style-conscious professionals"
    },
    testimonial: {
      quote: "The omnichannel transformation with CloudSeek has revolutionized how we serve our customers. We can now deliver truly seamless experiences whether our customers shop online, in-store, or through their mobile devices. The results have exceeded our expectations, with significant improvements in key metrics across all channels. Most importantly, our customers are more engaged and loyal than ever before.",
      author: "Alexandra Martinez",
      position: "Chief Digital Officer, FashionForward",
      avatar: "/images/avatars/alexandra-martinez.jpg"
    },
    keyMetrics: [
      { label: "Cross-Channel Revenue Growth", value: "+42%" },
      { label: "Mobile Conversion Rate", value: "+57%" },
      { label: "In-Store Digital Influence", value: "+63%" },
      { label: "Customer Retention", value: "+28%" }
    ]
  };

  // Performance metrics for visualization
  const performanceMetrics = {
    preImplementation: "w-1/4",
    postImplementation: "w-3/4",
    mobileRevenue: "w-[42%]",
    desktopRevenue: "w-[28%]",
    storeTraffic: "w-[35%]",
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "RetailNXT",
      slug: "retailnxt",
      description: "Customer retention transformation for fashion and lifestyle products retailer"
    },
    {
      title: "LuxeHome Furnishings",
      slug: "luxehome-furnishings",
      description: "E-commerce personalization strategy for premium home goods retailer"
    }
  ];

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
              <div className="flex flex-wrap gap-3 mb-8">
                {caseStudy.technology.slice(0, 4).map((tech, index) => (
                  <span key={index} className="bg-gray-800 text-gray-100 text-xs font-medium px-2.5 py-1 rounded">
                    {tech}
                  </span>
                ))}
                {caseStudy.technology.length > 4 && (
                  <span className="bg-gray-800 text-gray-100 text-xs font-medium px-2.5 py-1 rounded">
                    +{caseStudy.technology.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-16">
              {/* Main Content */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">The Challenge</h2>
                <p className="text-gray-700 mb-8">
                  {caseStudy.challenge}
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Solution</h2>
                <p className="text-gray-700 mb-4">
                  {caseStudy.solution}
                </p>
                
                <ul className="mb-8">
                  {caseStudy.solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start mb-3">
                      <div className="flex-shrink-0 mt-1 text-green-500">
                        <Check size={20} />
                      </div>
                      <p className="ml-3 text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Approach</h2>
                <p className="text-gray-700 mb-8">
                  {caseStudy.implementation}
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">The Results</h2>
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <ul className="space-y-4">
                    {caseStudy.results.map((result, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-blue-600">
                          <Award size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">{result}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <div className="text-blue-500 mr-3">
                      <Quote size={32} />
                    </div>
                    <div>
                      <p className="italic text-gray-700 mb-4">
                        "{caseStudy.testimonial.quote}"
                      </p>
                      <p className="font-medium text-gray-900">{caseStudy.testimonial.author}</p>
                      <p className="text-gray-600">{caseStudy.testimonial.position}</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Omnichannel Transformation Components</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-blue-600 mb-3">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Unified Shopping Experience</h3>
                    <p className="text-gray-600">
                      Consistent branding, pricing, and promotions across all channels with seamless customer journey transitions.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-blue-600 mb-3">
                      <Smartphone size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile-First Approach</h3>
                    <p className="text-gray-600">
                      Responsive design optimized for mobile shopping with location-based features and in-store mode for associates.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-blue-600 mb-3">
                      <RefreshCcw size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Fulfillment</h3>
                    <p className="text-gray-600">
                      BOPIS, ship-from-store, endless aisle, and traditional e-commerce delivery with real-time tracking.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-blue-600 mb-3">
                      <Tag size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Personalized Marketing</h3>
                    <p className="text-gray-600">
                      AI-driven product recommendations and targeted marketing based on unified customer profiles and behaviors.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg mb-8 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Client Information</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">Company:</span>
                      <span className="text-gray-600">{caseStudy.clientInfo.name}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">Industry:</span>
                      <span className="text-gray-600">{caseStudy.industry}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">Size:</span>
                      <span className="text-gray-600">{caseStudy.clientInfo.size}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">Founded:</span>
                      <span className="text-gray-600">{caseStudy.clientInfo.founded}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">Location:</span>
                      <span className="text-gray-600">{caseStudy.clientInfo.location}</span>
                    </li>
                  </ul>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Results</h3>
                  <div className="space-y-4">
                    {caseStudy.keyMetrics.map((metric, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-2xl font-bold text-blue-600">{metric.value}</p>
                        <p className="text-sm text-gray-600">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Channel Performance Improvement</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Mobile Revenue</span>
                      <span className="text-blue-600 font-medium">+42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.mobileRevenue}`}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Desktop Revenue</span>
                      <span className="text-blue-600 font-medium">+28%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.desktopRevenue}`}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">In-Store Traffic</span>
                      <span className="text-blue-600 font-medium">+35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.storeTraffic}`}></div>
                    </div>
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
              Ready to Transform Your Retail Experience?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization create a seamless omnichannel strategy that drives growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/retail" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Retail Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FashionForward; 