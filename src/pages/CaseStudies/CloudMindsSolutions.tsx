import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Code, ArrowRight, Award, Zap } from 'lucide-react';

const CloudMindsSolutions: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "CloudMinds Solutions",
    subtitle: "Customer Engagement Transformation",
    industry: "SaaS",
    challenge: "CloudMinds Solutions, a rapidly growing SaaS provider serving enterprise clients, faced significant challenges with customer engagement and retention. Their fragmented communication channels and lack of personalized customer journeys led to decreasing renewal rates and missed expansion opportunities. The customer success team struggled with reactive rather than proactive engagement, unable to leverage customer data effectively to predict needs and prevent churn.",
    solution: "We implemented a comprehensive Salesforce solution focused on transforming customer engagement processes. The solution included:",
    solutionPoints: [
      "Unified customer platform integrating data from product usage, support interactions, and billing systems",
      "Personalized customer journey mapping with automated touchpoints based on usage patterns",
      "Early warning system to identify at-risk accounts using predictive analytics",
      "Customer health scoring with customized success metrics for different customer segments",
      "Self-service portal with intelligent knowledge base and community features"
    ],
    results: [
      "182% increase in customer engagement metrics within 6 months",
      "Reduced time-to-resolution by 43% for customer support cases",
      "Net Revenue Retention improved from 98% to 118%",
      "35% increase in product adoption of premium features",
      "Customer Success team productivity improved by 62% through automation"
    ],
    implementation: "The implementation was delivered through an agile methodology over a 12-week period. We began with core data integration, followed by customer segmentation and journey design. After establishing the foundation, we implemented the health scoring system and predictive analytics capabilities. The final phase included adoption of the customer success platform by the entire team, with comprehensive training and change management support.",
    technology: ["Salesforce Service Cloud", "Salesforce Experience Cloud", "Einstein Analytics", "Marketing Cloud", "MuleSoft Integration", "Custom Success Metrics Dashboard"],
    clientInfo: {
      name: "CloudMinds Solutions",
      location: "Headquartered in Boston with global operations",
      size: "175 employees serving 600+ enterprise clients",
      founded: "2017",
      focus: "Enterprise collaboration SaaS platform"
    },
    testimonial: {
      quote: "The transformation of our customer engagement strategy with CloudSeek's expertise has been game-changing. We've moved from a reactive to a proactive approach, with deep insights into customer behavior that allow us to anticipate needs before they're even expressed. The impact on our retention and expansion revenue has far exceeded our expectations.",
      author: "Sarah Johnson",
      position: "VP of Customer Success, CloudMinds Solutions",
      avatar: "/images/avatars/sarah-johnson.jpg"
    },
    keyMetrics: [
      { label: "Engagement Increase", value: "182%" },
      { label: "Support Resolution Time", value: "-43%" },
      { label: "Net Revenue Retention", value: "118%" },
      { label: "Premium Feature Adoption", value: "+35%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "TechForward",
      slug: "techforward-customer-lifetime-value",
      description: "Customer lifetime value enhancement through advanced analytics"
    },
    {
      title: "DataFlow Systems",
      slug: "dataflow-systems",
      description: "Retention strategy optimization using Salesforce"
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex-shrink-0">
                  <img 
                    src={caseStudy.testimonial.avatar} 
                    alt={caseStudy.testimonial.author}
                    className="h-16 w-16 rounded-full object-cover" 
                  />
                </div>
                <div>
                  <p className="italic text-gray-700">"{caseStudy.testimonial.quote}"</p>
                  <p className="mt-2 font-medium text-gray-900">{caseStudy.testimonial.author}, {caseStudy.testimonial.position}</p>
                </div>
              </div>
              
              <div className="prose prose-lg prose-blue">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
                <p className="text-gray-700 mb-8">{caseStudy.challenge}</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h2>
                <p className="text-gray-700 mb-4">{caseStudy.solution}</p>
                <ul className="list-disc pl-6 mb-8 text-gray-700">
                  {caseStudy.solutionPoints.map((point, index) => (
                    <li key={index} className="mb-2">{point}</li>
                  ))}
                </ul>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
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
                <p className="text-gray-700 mb-8">{caseStudy.implementation}</p>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {caseStudy.technology.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {caseStudy.clientInfo.name}</h2>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> {caseStudy.clientInfo.location}</p>
                <p className="text-gray-700 mb-2"><strong>Company Size:</strong> {caseStudy.clientInfo.size}</p>
                <p className="text-gray-700 mb-2"><strong>Founded:</strong> {caseStudy.clientInfo.founded}</p>
                <p className="text-gray-700 mb-8"><strong>Focus:</strong> {caseStudy.clientInfo.focus}</p>
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
              Ready to Transform Your Customer Engagement?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization achieve exceptional customer engagement results with Salesforce.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/customer-success" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Customer Success Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CloudMindsSolutions; 