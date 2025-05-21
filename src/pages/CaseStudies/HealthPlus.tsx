import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Heart, ArrowRight, Award, Shield, Activity, Zap } from 'lucide-react';

const HealthPlus: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "HealthPlus",
    subtitle: "Patient Support Transformation with Service Cloud",
    industry: "Healthcare",
    challenge: "HealthPlus, a rapidly growing healthcare provider with 15+ locations and over 200,000 patients, was struggling with fragmented patient communication channels and slow support response times. Their outdated support system couldn't handle the increasing volume of patient inquiries, leading to long wait times, inconsistent information across channels, and frustrated patients. Support staff lacked visibility into patient history and previous interactions, making it difficult to provide personalized care.",
    solution: "We implemented a comprehensive Salesforce Service Cloud solution designed specifically for healthcare providers. The solution included:",
    solutionPoints: [
      "Unified patient support platform integrating phone, email, chat, and patient portal communications",
      "Automated case routing based on inquiry type, urgency, and staff expertise",
      "Knowledge base with AI-powered recommendations for common patient questions",
      "360-degree patient profiles bringing together medical history, support interactions, and appointment data",
      "HIPAA-compliant secure messaging and document exchange capabilities"
    ],
    results: [
      "68% reduction in support response time",
      "41% increase in first-call resolution rate",
      "92% improvement in patient satisfaction scores",
      "35% reduction in administrative workload",
      "Seamless transition during COVID-19 to telehealth support"
    ],
    implementation: "The implementation was completed in a phased approach over 4 months, with careful consideration for HIPAA compliance and data security. We provided comprehensive training for support staff, nurses, and administrators to ensure high adoption rates and effective use of the new system.",
    technology: ["Salesforce Service Cloud", "Health Cloud Components", "Einstein Case Classification", "Live Agent Chat", "Mobile App for Practitioners", "HIPAA-Compliant Document Management"],
    clientInfo: {
      name: "HealthPlus",
      location: "Headquartered in Chicago with 15+ locations across the Midwest",
      size: "450+ staff members serving over 200,000 patients",
      founded: "2008",
      focus: "Comprehensive primary care and specialized health services"
    },
    testimonial: {
      quote: "The Service Cloud implementation has transformed how we support our patients. Our staff now has instant access to the information they need, allowing them to provide faster, more personalized care. The efficiency gains have been remarkable, and most importantly, our patients are noticing the difference in their support experience.",
      author: "Dr. Jennifer Reyes",
      position: "Chief Medical Officer, HealthPlus",
      avatar: "/images/avatars/jennifer-reyes.jpg"
    },
    keyMetrics: [
      { label: "Response Time Reduction", value: "68%" },
      { label: "Patient Satisfaction", value: "+92%" },
      { label: "First-Call Resolution", value: "+41%" },
      { label: "Staff Efficiency", value: "+35%" }
    ]
  };

  // Performance metrics for visualization
  const performanceMetrics = {
    responseTime: "w-[68%]",
    patientSatisfaction: "w-[92%]",
    firstCallResolution: "w-[41%]",
    staffEfficiency: "w-[35%]"
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "HealthTech Innovations",
      slug: "healthtech-innovations",
      description: "Electronic health records integration and patient engagement"
    },
    {
      title: "TechForward",
      slug: "techforward",
      description: "Customer lifetime value enhancement through engagement strategies"
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
              <p className="text-2xl text-blue-300 mb-6">
                {caseStudy.subtitle}
              </p>
              <p className="text-xl text-gray-300 mb-8">
                How HealthPlus reduced patient support response time by 68% and transformed their patient experience with Salesforce Service Cloud
              </p>
            </div>
          </div>
        </section>
        
        {/* Client Overview Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-start md:gap-12">
              <div className="md:w-1/3 mb-8 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Overview</h2>
                <ul className="space-y-3 text-gray-600">
                  <li><span className="font-medium text-gray-900">Industry:</span> {caseStudy.industry}</li>
                  <li><span className="font-medium text-gray-900">Location:</span> {caseStudy.clientInfo.location}</li>
                  <li><span className="font-medium text-gray-900">Size:</span> {caseStudy.clientInfo.size}</li>
                  <li><span className="font-medium text-gray-900">Founded:</span> {caseStudy.clientInfo.founded}</li>
                </ul>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge</h2>
                <p className="text-gray-600 mb-6">
                  {caseStudy.challenge}
                </p>
                
                <div className="bg-red-50 p-5 rounded-lg mb-6 border-l-4 border-red-500">
                  <h3 className="text-lg font-bold text-red-800 mb-2">Key Challenges</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>Long patient wait times for support, with average response taking over 2 hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>Fragmented communication channels with no unified view of patient interactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>Support staff lacked access to complete patient history during interactions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>Inability to scale support operations during high-demand periods</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>Manual processes requiring excessive administrative time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Solution Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Solution</h2>
            
            <div className="md:flex md:items-center md:gap-12 mb-12">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <img 
                  src="/images/case-studies/healthplus-solution.jpg" 
                  alt="HealthPlus Service Cloud Dashboard" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              
              <div className="md:w-1/2">
                <p className="text-gray-600 mb-6">
                  {caseStudy.solution}
                </p>
                
                <ul className="space-y-4">
                  {caseStudy.solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1 text-green-500">
                        <Check size={20} />
                      </div>
                      <p className="ml-3 text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Implementation Approach</h3>
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[250px]">
                  <div className="bg-blue-50 p-4 rounded-lg h-full">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                    <h4 className="text-lg font-semibold text-center mb-2">Discovery & Planning</h4>
                    <p className="text-gray-600 text-center">Comprehensive analysis of patient support workflows and pain points</p>
                  </div>
                </div>
                
                <div className="flex-1 min-w-[250px]">
                  <div className="bg-blue-50 p-4 rounded-lg h-full">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                    <h4 className="text-lg font-semibold text-center mb-2">Solution Design</h4>
                    <p className="text-gray-600 text-center">HIPAA-compliant architecture with healthcare-specific customizations</p>
                  </div>
                </div>
                
                <div className="flex-1 min-w-[250px]">
                  <div className="bg-blue-50 p-4 rounded-lg h-full">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                    <h4 className="text-lg font-semibold text-center mb-2">Implementation</h4>
                    <p className="text-gray-600 text-center">Phased rollout with data migration and integration with EHR systems</p>
                  </div>
                </div>
                
                <div className="flex-1 min-w-[250px]">
                  <div className="bg-blue-50 p-4 rounded-lg h-full">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                    <h4 className="text-lg font-semibold text-center mb-2">Training & Adoption</h4>
                    <p className="text-gray-600 text-center">Comprehensive training program for all staff members with role-specific guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technologies Used Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technologies Used</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {caseStudy.technology.map((tech, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-blue-600 mb-2">
                    {index === 0 && <Activity size={32} className="mx-auto" />}
                    {index === 1 && <Heart size={32} className="mx-auto" />}
                    {index === 2 && <Zap size={32} className="mx-auto" />}
                    {index === 3 && <Users size={32} className="mx-auto" />}
                    {index === 4 && <Shield size={32} className="mx-auto" />}
                    {index === 5 && <Award size={32} className="mx-auto" />}
                  </div>
                  <h3 className="font-medium text-gray-900">{tech}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Results Section */}
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Results & Impact</h2>
            
            <div className="md:flex md:items-center md:gap-12 mb-12">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Key Performance Improvements</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">Response Time Reduction</span>
                        <span className="text-blue-600 font-medium">68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.responseTime}`}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">Patient Satisfaction</span>
                        <span className="text-blue-600 font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.patientSatisfaction}`}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">First-Call Resolution</span>
                        <span className="text-blue-600 font-medium">41%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.firstCallResolution}`}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">Staff Efficiency</span>
                        <span className="text-blue-600 font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`bg-blue-600 h-2 rounded-full ${performanceMetrics.staffEfficiency}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1 text-blue-600">
                      <Quote size={36} />
                    </div>
                    <blockquote className="ml-4">
                      <p className="text-gray-600 italic mb-4">
                        {caseStudy.testimonial.quote}
                      </p>
                      <footer className="flex items-center">
                        <img 
                          src={caseStudy.testimonial.avatar} 
                          alt={caseStudy.testimonial.author}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{caseStudy.testimonial.author}</p>
                          <p className="text-gray-600">{caseStudy.testimonial.position}</p>
                        </div>
                      </footer>
                    </blockquote>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Additional Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 text-green-600">
                        <Check size={20} />
                      </div>
                      <p className="ml-3 text-gray-700">Seamless transition to telehealth support during COVID-19</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 text-green-600">
                        <Check size={20} />
                      </div>
                      <p className="ml-3 text-gray-700">Increased capacity to handle 42% more patient inquiries without adding staff</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 text-green-600">
                        <Check size={20} />
                      </div>
                      <p className="ml-3 text-gray-700">Decreased staff turnover due to improved systems and reduced workload</p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 text-green-600">
                        <Check size={20} />
                      </div>
                      <p className="ml-3 text-gray-700">Enhanced ability to identify and address common patient concerns</p>
                    </li>
                  </ul>
                </div>
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
              Ready to Transform Your Healthcare Support?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization improve patient experience and support efficiency with Salesforce Service Cloud.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/healthcare" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Healthcare Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HealthPlus; 