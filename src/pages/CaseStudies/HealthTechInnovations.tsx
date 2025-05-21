import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Heart, ArrowRight, Award, Shield, Activity, FileText } from 'lucide-react';

const HealthTechInnovations: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "HealthTech Innovations",
    subtitle: "Revolutionary Healthcare Technology Provider",
    industry: "Healthcare",
    challenge: "HealthTech Innovations, a leading provider of healthcare technology solutions serving 200+ hospitals nationwide, faced significant challenges in managing patient data, ensuring regulatory compliance, and facilitating seamless coordination between healthcare providers. Their existing systems were fragmented across departments and facilities, resulting in inefficient workflows, potential compliance risks, and suboptimal patient experiences. Medical staff frequently had to navigate multiple interfaces to access complete patient information, and administrators struggled with comprehensive reporting across their network.",
    solution: "We developed a comprehensive Salesforce Health Cloud solution to centralize patient information and improve data accessibility while maintaining strict HIPAA compliance. The solution included:",
    solutionPoints: [
      "Unified patient records with 360° view of medical history, treatments, and provider interactions",
      "HIPAA-compliant data management protocols with role-based access controls",
      "Automated care coordination workflows between departments and facilities",
      "Custom compliance reporting dashboards for regulatory requirements",
      "Secure provider-to-provider communication channels",
      "Patient engagement tools including appointment scheduling and follow-up reminders"
    ],
    results: [
      "40% improvement in patient data retrieval times for medical staff",
      "Enhanced compliance with healthcare regulations with automated audit trails",
      "35% reduction in administrative overhead for record management",
      "62% faster patient onboarding process across all facilities",
      "28% increase in patient satisfaction scores due to improved care coordination"
    ],
    implementation: "The implementation was conducted through a phased approach over 8 months, beginning with core patient data migration and security framework establishment. We followed with care coordination workflows, then provider collaboration tools, and finally patient engagement features. Throughout the process, we worked closely with clinical staff, administrators, and compliance officers to ensure the solution met the complex needs of all stakeholders while maintaining the highest security standards. Comprehensive training was provided to over 3,000 healthcare professionals.",
    technology: ["Salesforce Health Cloud", "HIPAA Compliance Framework", "MuleSoft Integration", "Einstein Analytics", "Experience Cloud", "Mobile Solutions", "Encryption and Security Protocols"],
    clientInfo: {
      name: "HealthTech Innovations",
      location: "Headquartered in Boston with regional offices across the United States",
      size: "1,200+ employees supporting 200+ hospitals and healthcare facilities",
      founded: "2008",
      focus: "Innovative healthcare technology solutions for hospitals and medical providers"
    },
    testimonial: {
      quote: "Our partnership with CloudSeek has enabled us to innovate in patient care and streamline our operations. The Health Cloud implementation has transformed how our medical professionals access and utilize patient information. We've seen significant improvements in efficiency, compliance, and most importantly, the quality of care we provide. The solution has scaled seamlessly across our network of facilities, giving us a truly unified healthcare information system.",
      author: "Dr. Sarah Johnson",
      position: "Chief Medical Information Officer, HealthTech Innovations",
      avatar: "/images/avatars/sarah-johnson.jpg"
    },
    keyMetrics: [
      { label: "Data Retrieval Improvement", value: "40%" },
      { label: "Administrative Overhead Reduction", value: "35%" },
      { label: "Patient Satisfaction Increase", value: "28%" },
      { label: "Onboarding Time Reduction", value: "62%" }
    ]
  };

  // Related case studies
  const relatedCaseStudies = [
    {
      title: "Global Financial Corp",
      slug: "global-financial-corp",
      description: "Data unification and operational efficiency for financial services"
    },
    {
      title: "Strategic Consulting Group",
      slug: "strategic-consulting-group",
      description: "From siloed data to 360° client view for consulting firm"
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
              Ready to Transform Your Healthcare Technology?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization improve patient care through innovative Salesforce solutions.
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

export default HealthTechInnovations; 