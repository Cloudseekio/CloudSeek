import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Monitor, ArrowRight, Award, Zap, Target, LineChart } from 'lucide-react';

const TechVision: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "TechVision",
    subtitle: "Sales Process Transformation with Sales Cloud",
    industry: "Technology Solutions",
    challenge: "TechVision, a growing IT solutions provider specializing in enterprise software and managed services, was struggling with fragmented sales processes and poor visibility into their pipeline. Their legacy CRM couldn't scale with their rapid growth, and sales representatives were using inconsistent methods to track opportunities. This resulted in missed follow-ups, inaccurate forecasting, and limited collaboration between sales teams across their five regional offices.",
    solution: "We implemented a comprehensive Salesforce Sales Cloud solution tailored to TechVision's unique sales methodology. The solution included:",
    solutionPoints: [
      "Custom sales process aligned with TechVision's enterprise and SMB sales tracks",
      "Automated lead routing and scoring based on prospect firmographics and behavior",
      "Interactive dashboards providing real-time pipeline visibility and forecast accuracy",
      "Mobile optimization enabling field sales teams to update opportunities on-the-go",
      "Integration with marketing automation for seamless lead handoff and attribution"
    ],
    results: [
      "42% increase in overall sales within 12 months",
      "68% improvement in lead response time",
      "35% higher win rate on competitive deals",
      "57% reduction in sales cycle length",
      "91% user adoption among sales representatives"
    ],
    implementation: "The implementation was completed in a phased approach over 3 months, starting with core CRM functionality, followed by advanced analytics and automation. We provided comprehensive training sessions for sales leaders, account executives, and sales development representatives to ensure high adoption rates.",
    technology: ["Salesforce Sales Cloud", "Salesforce Mobile", "Einstein Analytics", "CPQ", "Lightning Dashboards", "Salesforce Inbox"],
    clientInfo: {
      name: "TechVision",
      location: "Headquartered in Boston with regional offices in 5 major U.S. cities",
      size: "150+ employees, serving 500+ enterprise clients",
      founded: "2008",
      focus: "Enterprise software solutions and managed IT services"
    },
    testimonial: {
      quote: "CloudSeek's Sales Cloud implementation transformed our entire sales organization. The customized solution aligned perfectly with how our teams actually sell, rather than forcing us to change our proven methodology. The visibility we now have into our pipeline has dramatically improved our forecasting accuracy, while the automation has freed our sales team to focus on what they do best—building relationships with clients and closing deals.",
      author: "Michael Reeves",
      position: "VP of Sales, TechVision",
      avatar: "/images/avatars/michael-reeves.jpg"
    },
    keyMetrics: [
      { label: "Sales Growth", value: "+42%" },
      { label: "Lead Response Time", value: "-68%" },
      { label: "Win Rate", value: "+35%" },
      { label: "Sales Cycle", value: "-57%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "HealthTech Innovations",
      slug: "healthtech-innovations",
      description: "Patient engagement platform optimization for healthcare technology provider"
    },
    {
      title: "Strategic Consulting Group",
      slug: "strategic-consulting-group",
      description: "From siloed data to 360° client view for consulting firm"
    }
  ];

  // Performance metrics visualization
  const performanceMetrics = {
    leadQualification: "w-3/4",
    salesCycle: "w-2/5",
    forecastAccuracy: "w-4/5",
    teamCollaboration: "w-7/10"
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
              <div className="flex flex-wrap gap-6">
                {caseStudy.keyMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">{metric.value}</p>
                    <p className="text-sm text-gray-300">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-16">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
                <p className="text-gray-700 mb-10 text-lg leading-relaxed">
                  {caseStudy.challenge}
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {caseStudy.solution}
                </p>
                
                <ul className="mb-10 space-y-4">
                  {caseStudy.solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 mt-1 text-green-500">
                        <Check size={20} />
                      </span>
                      <p className="ml-3 text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Results</h2>
                <div className="bg-gray-50 p-6 rounded-lg mb-10">
                  <ul className="space-y-4">
                    {caseStudy.results.map((result, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 mt-1 text-green-500">
                          <Check size={20} />
                        </span>
                        <p className="ml-3 text-gray-700 font-medium">{result}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Implementation Approach</h2>
                <p className="text-gray-700 mb-10 text-lg leading-relaxed">
                  {caseStudy.implementation}
                </p>
                
                <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-500 mb-10">
                  <Quote size={40} className="text-blue-300 mb-4" />
                  <p className="text-xl text-gray-700 italic mb-6">
                    "{caseStudy.testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={caseStudy.testimonial.avatar} 
                      alt={caseStudy.testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{caseStudy.testimonial.author}</p>
                      <p className="text-gray-600">{caseStudy.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-gray-50 p-6 rounded-lg mb-8 sticky top-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About {caseStudy.clientInfo.name}</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 mt-1 text-blue-500">
                        <Target size={18} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Industry</p>
                        <p className="text-sm text-gray-600">{caseStudy.industry}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 mt-1 text-blue-500">
                        <Monitor size={18} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Company Focus</p>
                        <p className="text-sm text-gray-600">{caseStudy.clientInfo.focus}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 mt-1 text-blue-500">
                        <Users size={18} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Company Size</p>
                        <p className="text-sm text-gray-600">{caseStudy.clientInfo.size}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 mt-1 text-blue-500">
                        <Clock size={18} />
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Founded</p>
                        <p className="text-sm text-gray-600">{caseStudy.clientInfo.founded}</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="border-t border-gray-200 my-6 pt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.technology.map((tech, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="mt-16 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Performance Improvements</h2>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Lead Qualification Effectiveness</span>
                    <span className="text-blue-600 font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.leadQualification}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Sales Cycle Reduction</span>
                    <span className="text-blue-600 font-medium">57%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.salesCycle}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Forecast Accuracy</span>
                    <span className="text-blue-600 font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.forecastAccuracy}`}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Cross-Team Collaboration</span>
                    <span className="text-blue-600 font-medium">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.teamCollaboration}`}></div>
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
              Ready to Transform Your Sales Process?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization achieve exceptional results with Salesforce Sales Cloud.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/sales-cloud" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Sales Cloud Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TechVision; 