import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Code, ArrowRight, Award, Zap } from 'lucide-react';

const DataFlowSystems: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "DataFlow Systems",
    subtitle: "Retention Strategy Optimization Using Salesforce",
    industry: "Data Management",
    challenge: "DataFlow Systems, a leading data management platform provider, faced increasing customer churn as they scaled their enterprise client base. Despite collecting vast amounts of customer usage data, they struggled to translate this information into actionable retention strategies. Support teams were working reactively, often addressing customer concerns too late in the relationship lifecycle, while account managers lacked clear visibility into product adoption and customer health metrics.",
    solution: "We designed and implemented a comprehensive retention strategy powered by Salesforce, with a focus on predictive analytics and proactive customer success. The solution included:",
    solutionPoints: [
      "Unified customer data platform that consolidated product usage, support tickets, and financial information",
      "Predictive churn model using Einstein Analytics to identify at-risk customers before traditional warning signs appeared",
      "Automated customer journey touchpoints based on usage patterns and engagement metrics",
      "Customer health dashboard providing real-time visibility into adoption, satisfaction, and growth potential",
      "Automated escalation workflows to ensure timely intervention by the appropriate team members"
    ],
    results: [
      "Reduced annual churn rate from 22% to 8.3% within 12 months",
      "58% increase in customer satisfaction scores across all segments",
      "Net Revenue Retention improved from 94% to 112%",
      "Customer Success team capacity increased by 40% through automation",
      "Early warning system now identifies 87% of at-risk accounts before traditional indicators"
    ],
    implementation: "The implementation was conducted in three phases over a 14-week period. Phase one focused on data integration and unified customer profiles. Phase two involved building the predictive models and custom customer health scoring system. The final phase deployed the automation workflows and customer success team tools, along with comprehensive training to ensure high adoption rates across teams.",
    technology: ["Salesforce Sales Cloud", "Salesforce Service Cloud", "Einstein Analytics", "Salesforce Marketing Cloud", "MuleSoft Integration", "Tableau CRM"],
    clientInfo: {
      name: "DataFlow Systems",
      location: "Headquartered in Austin with offices across the US and Europe",
      size: "230+ employees serving 1,200+ enterprise customers",
      founded: "2014",
      focus: "Enterprise data management and integration platform"
    },
    testimonial: {
      quote: "CloudSeek transformed our approach to customer retention by giving us the ability to not just understand our customers, but to predict their needs and challenges. The Salesforce solution they implemented has changed how we think about customer success, moving us from reactive firefighting to proactive relationship building. The impact on our retention metrics and overall revenue has been remarkable.",
      author: "David Rodriguez",
      position: "Chief Revenue Officer, DataFlow Systems",
      avatar: "/images/avatars/david-rodriguez.jpg"
    },
    keyMetrics: [
      { label: "Churn Reduction", value: "62%" },
      { label: "Customer Satisfaction", value: "+58%" },
      { label: "Net Revenue Retention", value: "112%" },
      { label: "Risk Detection Rate", value: "87%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "CloudMinds Solutions",
      slug: "cloudminds-solutions",
      description: "Customer engagement transformation for SaaS provider"
    },
    {
      title: "TechForward",
      slug: "techforward-customer-lifetime-value",
      description: "Customer lifetime value enhancement through advanced analytics"
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
              Ready to Optimize Your Customer Retention Strategy?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization build a data-driven approach to customer retention using Salesforce.
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

export default DataFlowSystems; 