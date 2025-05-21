import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Code, ArrowRight, Award, Zap, Target, LineChart, Filter, Star } from 'lucide-react';

const TechSolutions: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "TechSolutions",
    subtitle: "Lead Qualification Transformation with Pardot",
    industry: "Technology Services",
    challenge: "TechSolutions, a B2B technology services company specializing in enterprise IT and cloud solutions, struggled with inefficient lead qualification processes that wasted valuable sales resources. Their sales team was spending excessive time pursuing leads that rarely converted, while their marketing team had no visibility into which campaigns were generating qualified prospects. Manual lead scoring was inconsistent, marketing and sales were misaligned on lead definitions, and their CRM data was fragmented across multiple systems. With a growing product portfolio and expanding target markets, they needed a more sophisticated approach to identify and nurture high-potential opportunities.",
    solution: "We implemented a comprehensive Salesforce Pardot solution with custom lead scoring and qualification automation. The solution included:",
    solutionPoints: [
      "Unified prospect database integrating website behavior, email engagement, and CRM data",
      "Advanced lead scoring models based on demographic, firmographic, and behavioral data",
      "Multi-touch attribution reporting to measure campaign effectiveness",
      "Automated nurture campaigns tailored to different buyer personas and sales stages",
      "Custom qualification rules to route leads to the appropriate sales representatives",
      "Seamless integration with Salesforce CRM for a unified lead-to-revenue view"
    ],
    results: [
      "215% increase in qualified leads passed to sales",
      "68% reduction in sales cycle length",
      "42% improvement in lead-to-opportunity conversion rate",
      "73% of marketing-sourced leads now resulting in sales meetings",
      "3.2x ROI on marketing campaign spend"
    ],
    implementation: "The implementation was completed over a 10-week period, including data migration, integration with existing systems, and comprehensive training for marketing and sales teams. We established a collaborative lead scoring framework that aligned marketing and sales on lead quality definitions.",
    technology: ["Salesforce Pardot", "Engagement Studio", "Lead Scoring & Grading", "Salesforce CRM Integration", "Einstein Analytics", "Custom Landing Pages", "Form Handlers", "Campaign Influence Models"],
    clientInfo: {
      name: "TechSolutions",
      industry: "Technology Services",
      location: "Headquartered in Boston with offices nationwide",
      size: "Mid-size company with 250+ employees"
    },
    testimonial: {
      quote: "The Pardot implementation has completely transformed our lead management process. Before, our sales team was wasting countless hours on leads that were never going to convert. Now, the quality of leads they're receiving is exceptional, and our marketing team has clear visibility into which campaigns are actually driving pipeline. The alignment between our sales and marketing teams has never been better.",
      author: "Michael Reynolds",
      position: "VP of Marketing, TechSolutions",
      avatar: "/images/avatars/michael-reynolds.jpg"
    },
    keyMetrics: [
      { label: "Qualified Leads", value: "+215%" },
      { label: "Sales Cycle", value: "-68%" },
      { label: "Conversion Rate", value: "+42%" },
      { label: "Meeting Success Rate", value: "73%" }
    ]
  };

  // Performance metrics for visualization
  const performanceMetrics = {
    qualifiedLeads: "w-[100%]", // Using 100% as maximum for display
    salesCycle: "w-[68%]",
    conversionRate: "w-[42%]",
    marketingROI: "w-[76%]"
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "TechVision",
      slug: "tech-vision",
      description: "Sales Process Transformation with Sales Cloud"
    },
    {
      title: "RetailMax",
      slug: "retail-max",
      description: "Email Marketing Transformation with Marketing Cloud"
    }
  ];

  // Lead funnel data (before and after)
  const leadFunnelData = [
    { 
      stage: "Website Visitors", 
      before: 15000, 
      after: 15000, 
      beforeLabel: "15,000", 
      afterLabel: "15,000", 
      change: "0%" 
    },
    { 
      stage: "Lead Form Submissions", 
      before: 750, 
      after: 1200, 
      beforeLabel: "750", 
      afterLabel: "1,200", 
      change: "+60%" 
    },
    { 
      stage: "Marketing Qualified Leads", 
      before: 180, 
      after: 540, 
      beforeLabel: "180", 
      afterLabel: "540", 
      change: "+200%" 
    },
    { 
      stage: "Sales Qualified Leads", 
      before: 65, 
      after: 205, 
      beforeLabel: "65", 
      afterLabel: "205", 
      change: "+215%" 
    },
    { 
      stage: "Opportunities Created", 
      before: 28, 
      after: 112, 
      beforeLabel: "28", 
      afterLabel: "112", 
      change: "+300%" 
    },
    { 
      stage: "Closed Won Deals", 
      before: 12, 
      after: 48, 
      beforeLabel: "12", 
      afterLabel: "48", 
      change: "+300%" 
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
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <span className="font-semibold block">Company:</span>
                      {caseStudy.clientInfo.name}
                    </div>
                    <div>
                      <span className="font-semibold block">Industry:</span>
                      {caseStudy.clientInfo.industry}
                    </div>
                    <div>
                      <span className="font-semibold block">Location:</span>
                      {caseStudy.clientInfo.location}
                    </div>
                    <div>
                      <span className="font-semibold block">Company Size:</span>
                      {caseStudy.clientInfo.size}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Technologies Used</h3>
                  <div className="space-y-2">
                    {caseStudy.technology.map((tech, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{tech}</span>
                      </div>
                    ))}
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
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-blue-600 h-2 rounded-full ${
                              Object.values(performanceMetrics)[index]
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none mb-12">
                  <h2>The Challenge</h2>
                  <p>{caseStudy.challenge}</p>
                  
                  <h2>Our Solution</h2>
                  <p>{caseStudy.solution}</p>
                  
                  <ul>
                    {caseStudy.solutionPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="text-green-500 mt-1 mr-2 flex-shrink-0" size={20} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h2>Implementation Approach</h2>
                  <p>{caseStudy.implementation}</p>
                  
                  <h2>Results & Impact</h2>
                  <p>The implementation of Pardot transformed TechSolutions' lead management process, delivering remarkable results across their marketing and sales operations:</p>
                </div>
                
                {/* Lead Funnel Transformation */}
                <div className="mb-12 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Lead Funnel Transformation</h3>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Funnel Stage
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Before
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              After
                            </th>
                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Change
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {leadFunnelData.map((stage, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {stage.stage}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {stage.beforeLabel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {stage.afterLabel}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                stage.change.includes('+') ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {stage.change}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Key Achievements */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <Target className="text-blue-600 mb-4" size={28} />
                      <h4 className="font-bold text-gray-900 mb-2">Enhanced Lead Scoring Accuracy</h4>
                      <p className="text-gray-600">Implemented a sophisticated two-dimensional scoring model that combines demographic fit (grade) with engagement level (score), resulting in 87% more accurate lead prioritization.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <Filter className="text-blue-600 mb-4" size={28} />
                      <h4 className="font-bold text-gray-900 mb-2">Automated Lead Qualification</h4>
                      <p className="text-gray-600">Created dynamic lead qualification rules that automatically route leads to the appropriate teams based on product interest, company size, and engagement level.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <LineChart className="text-blue-600 mb-4" size={28} />
                      <h4 className="font-bold text-gray-900 mb-2">Campaign Performance Visibility</h4>
                      <p className="text-gray-600">Implemented multi-touch attribution reporting to accurately measure the impact of different marketing channels on pipeline and revenue.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <Star className="text-blue-600 mb-4" size={28} />
                      <h4 className="font-bold text-gray-900 mb-2">Sales & Marketing Alignment</h4>
                      <p className="text-gray-600">Created a shared SLA framework that established clear definitions of lead quality and hand-off processes between marketing and sales teams.</p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="mb-12">
                  <div className="bg-blue-50 rounded-lg p-8 relative">
                    <Quote className="text-blue-200 absolute top-4 left-4" size={40} />
                    <div className="relative z-10">
                      <blockquote>
                        <p className="text-lg font-medium text-gray-800 mb-6 mt-4 ml-4">
                          "{caseStudy.testimonial.quote}"
                        </p>
                        <footer className="flex items-center">
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
                        </footer>
                      </blockquote>
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
                        <p className="ml-3 text-gray-700">Marketing team efficiency improved by 40%, allowing focus on high-value creative and strategic initiatives</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Sales productivity increased by 35% as representatives focused exclusively on qualified opportunities</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Data-driven insights enabled more effective budget allocation across marketing channels</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <Check size={20} />
                        </div>
                        <p className="ml-3 text-gray-700">Established a sustainable lead generation engine that supports continued business growth</p>
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
              Ready to Transform Your Lead Generation?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how our Pardot expertise can help your organization qualify more leads and accelerate your sales pipeline.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/pardot" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Pardot Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TechSolutions; 