import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, DollarSign, ArrowRight, Award, Globe, Shield, LineChart } from 'lucide-react';

const GlobalFinancialCorp: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "Global Financial Corp",
    subtitle: "Leading Multinational Financial Services Company",
    industry: "Financial Services",
    challenge: "Global Financial Corp, a leading multinational financial services company with operations in over 30 countries, faced significant challenges with fragmented customer data and inefficient processes. Their legacy systems operated in silos, making it difficult to gain a unified view of customers who used multiple services across different regions. This fragmentation resulted in disjointed customer experiences, compliance risks, and missed cross-selling opportunities. Additionally, manual processes were creating operational bottlenecks and increasing costs.",
    solution: "We implemented a comprehensive Salesforce solution to integrate customer data, streamline operations, and enhance customer engagement across their global footprint. The solution included:",
    solutionPoints: [
      "Unified Customer 360 platform integrating data from multiple legacy systems",
      "Custom-built compliance and risk management modules tailored to different regional regulatory requirements",
      "Automated workflow processes for customer onboarding and service requests",
      "Cross-border collaboration tools enabling seamless handoffs between teams",
      "Multi-language and multi-currency support for global operations",
      "Advanced analytics and reporting for executive decision-making"
    ],
    results: [
      "30% increase in customer satisfaction scores within the first year",
      "25% reduction in operational costs through process automation",
      "42% improvement in cross-border transaction efficiency",
      "56% faster customer onboarding process across all regions",
      "38% increase in successful cross-selling opportunities"
    ],
    implementation: "The implementation was structured as a 14-month global rollout, beginning with a pilot in their North American operations, followed by staged deployments across Europe, Asia-Pacific, and Latin America. We established a global center of excellence to manage the transformation, ensuring consistent practices while accommodating regional variations. Robust change management and training programs were key to achieving high adoption rates across diverse teams.",
    technology: ["Salesforce Financial Services Cloud", "Einstein Analytics", "MuleSoft Integration", "Salesforce Shield", "Tableau CRM", "Experience Cloud", "Marketing Cloud"],
    clientInfo: {
      name: "Global Financial Corp",
      location: "Headquartered in London with operations in over 30 countries",
      size: "15,000+ employees serving more than 5 million customers worldwide",
      founded: "1985",
      focus: "Comprehensive financial services including banking, wealth management, and investment services"
    },
    testimonial: {
      quote: "The Salesforce implementation has transformed our operations, allowing us to serve our clients better across the globe. For the first time, we have a unified view of our customers regardless of which services they use or where they're located. The efficiency gains have been substantial, and our teams are now empowered with the insights they need to deliver truly personalized financial guidance.",
      author: "Jonathan Reynolds",
      position: "Chief Digital Officer, Global Financial Corp",
      avatar: "/images/avatars/jonathan-reynolds.jpg"
    },
    keyMetrics: [
      { label: "Customer Satisfaction", value: "+30%" },
      { label: "Operational Cost Reduction", value: "25%" },
      { label: "Cross-Border Efficiency", value: "+42%" },
      { label: "Onboarding Time Reduction", value: "56%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "Strategic Consulting Group",
      slug: "strategic-consulting-group",
      description: "From siloed data to 360° client view for consulting firm"
    },
    {
      title: "TechForward",
      slug: "tech-forward",
      description: "Customer lifetime value enhancement for technology company"
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
              Ready to Transform Your Financial Services?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization create unified customer experiences across global operations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/financial-services" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Financial Services Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GlobalFinancialCorp; 