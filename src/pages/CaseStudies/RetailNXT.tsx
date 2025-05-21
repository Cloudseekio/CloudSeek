import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, ArrowRight } from 'lucide-react';

const RetailNXT: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "RetailNXT",
    subtitle: "Customer Retention Improvement",
    industry: "Retail",
    challenge: "RetailNXT, a mid-sized omnichannel retailer with 12 physical locations and a growing e-commerce presence, struggled to retain customers despite high traffic to their online store. Their customer acquisition costs were steadily increasing while lifetime value remained stagnant. They had a wealth of customer data but lacked the ability to transform it into actionable insights and personalized experiences. Despite offering competitive products and pricing, they were losing customers to competitors who provided more tailored shopping experiences.",
    solution: "We implemented a comprehensive personalized marketing strategy using Salesforce Marketing Cloud, integrated with their existing e-commerce platform. The solution included:",
    solutionPoints: [
      "Customer segmentation based on purchase history, browsing behavior, and demographic data",
      "Personalized email journeys with dynamic content based on individual preferences",
      "Abandoned cart recovery automation with incentive optimization",
      "Post-purchase nurture campaigns to encourage repeat business",
      "Cross-channel coordination between online and in-store experiences",
      "AI-powered product recommendations based on predictive analytics"
    ],
    results: [
      "63% increase in customer retention rate within 6 months",
      "40% increase in repeat purchases from existing customers",
      "28% reduction in customer acquisition costs",
      "52% improvement in email campaign engagement metrics",
      "37% increase in average customer lifetime value"
    ],
    implementation: "The implementation was executed in three phases over 4 months. Phase one focused on data integration and cleansing, establishing a single customer view across channels. Phase two involved building the segmentation model and setting up the initial automated journeys. Phase three expanded to more sophisticated personalization and predictive elements. Throughout the process, we conducted A/B testing to optimize messaging and offers.",
    technology: ["Salesforce Marketing Cloud", "Einstein Analytics", "Journey Builder", "Personalization Builder", "Mobile Studio", "Commerce Cloud Integration"],
    clientInfo: {
      name: "RetailNXT",
      location: "Headquartered in Boston with locations across the Northeast",
      size: "250+ employees, 12 physical stores, and e-commerce operations",
      founded: "2010",
      focus: "Contemporary fashion and lifestyle products for young professionals"
    },
    testimonial: {
      quote: "CloudSeek's approach helped us understand our customers better than we ever have before. The personalized marketing strategy transformed how we engage with shoppers, both online and in-store. The results have been exceptional – not just in terms of retention metrics, but also in the quality of customer relationships we're building. Our team now has the tools and insights to deliver truly relevant experiences that keep customers coming back.",
      author: "Rebecca Chen",
      position: "VP of Digital Marketing, RetailNXT",
      avatar: "/images/avatars/rebecca-chen.jpg"
    },
    keyMetrics: [
      { label: "Customer Retention", value: "+63%" },
      { label: "Repeat Purchases", value: "+40%" },
      { label: "Email Engagement", value: "+52%" },
      { label: "Customer Lifetime Value", value: "+37%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "LuxeHome Furnishings",
      slug: "luxehome-furnishings",
      description: "E-commerce personalization strategy for home goods retailer"
    },
    {
      title: "FashionForward",
      slug: "fashion-forward",
      description: "Omnichannel retail transformation with Salesforce Commerce Cloud"
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
              <div className="flex flex-wrap gap-6 mt-8">
                {caseStudy.keyMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                    <p className="text-blue-300 text-sm">{metric.label}</p>
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:gap-12">
              <div className="md:w-2/3">
                <div className="bg-white rounded-lg overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
                    <p className="text-gray-700 mb-6">
                      {caseStudy.challenge}
                    </p>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
                    <p className="text-gray-700 mb-4">
                      {caseStudy.solution}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {caseStudy.solutionPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-blue-100 p-1 rounded-full mr-3 flex-shrink-0 mt-1">
                            <Check size={12} className="text-blue-600" />
                          </div>
                          <p className="text-gray-700">{point}</p>
                        </li>
                      ))}
                    </ul>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">The Results</h2>
                    <div className="space-y-3 mb-6">
                      {caseStudy.results.map((result, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                            <Check size={16} className="text-green-600" />
                          </div>
                          <p className="text-gray-700">{result}</p>
                        </div>
                      ))}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Implementation Approach</h2>
                    <p className="text-gray-700 mb-6">
                      {caseStudy.implementation}
                    </p>
                    
                    <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
                      <Quote size={24} className="text-blue-500 mb-4" />
                      <p className="italic text-gray-700 mb-4">
                        {caseStudy.testimonial.quote}
                      </p>
                      <div className="flex items-center">
                        <img 
                          src={caseStudy.testimonial.avatar} 
                          alt={caseStudy.testimonial.author} 
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{caseStudy.testimonial.author}</p>
                          <p className="text-gray-600">{caseStudy.testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 mb-8 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {caseStudy.technology.map((tech, index) => (
                      <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1.5 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {caseStudy.clientInfo.name}</h2>
                  <p className="text-gray-700 mb-2"><strong>Location:</strong> {caseStudy.clientInfo.location}</p>
                  <p className="text-gray-700 mb-2"><strong>Company Size:</strong> {caseStudy.clientInfo.size}</p>
                  <p className="text-gray-700 mb-2"><strong>Founded:</strong> {caseStudy.clientInfo.founded}</p>
                  <p className="text-gray-700 mb-8"><strong>Focus:</strong> {caseStudy.clientInfo.focus}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Case Studies</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedCaseStudies.map((relatedCase, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{relatedCase.title}</h3>
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
            
            <div className="text-center mt-16">
              <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block transition-colors text-lg font-medium">
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-16 rounded-2xl overflow-hidden w-[94%] mx-auto my-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Improve Your Customer Retention?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization create personalized experiences that keep customers coming back.
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
                Explore Marketing Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RetailNXT; 