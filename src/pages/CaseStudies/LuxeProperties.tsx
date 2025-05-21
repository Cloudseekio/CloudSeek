import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Building, ArrowRight, Award, Star, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const LuxeProperties: React.FC = () => {
  // Case study data
  const caseStudy = {
    title: "Luxe Properties Group",
    subtitle: "Digital Transformation & CRM Implementation",
    industry: "Real Estate",
    challenge: "Luxe Properties, a luxury real estate brokerage with 200+ agents, struggled with fragmented customer data and inefficient lead management. Their previous systems couldn't scale with their rapid growth, resulting in missed opportunities and inconsistent client experiences across multiple offices.",
    solution: "We implemented a custom Salesforce Real Estate Cloud solution with integrated marketing automation, agent performance dashboards, and mobile functionality. The solution included:",
    solutionPoints: [
      "Unified CRM platform connecting all client interactions across digital and in-person touchpoints",
      "Custom property listing management integrated with MLS systems",
      "Automated marketing journeys for different property types and price points",
      "Mobile application for agents to access client data and property details in the field",
      "Performance analytics dashboard with commission tracking and goal management"
    ],
    results: [
      "Increased lead conversion rate by 37%",
      "28% reduction in average sales cycle",
      "Improved agent productivity by 45%",
      "$2.4M additional revenue in first year",
      "98% agent adoption of the platform within 3 months"
    ],
    implementation: "The implementation was completed in three phases over 4 months, with minimal disruption to daily operations. We provided comprehensive training sessions for all agents and administrative staff to ensure smooth adoption.",
    technology: ["Salesforce Real Estate Cloud", "Marketing Cloud", "Salesforce Mobile", "Einstein Analytics", "MLS Integration", "DocuSign Integration"],
    clientInfo: {
      name: "Luxe Properties Group",
      location: "Headquartered in Miami with offices in New York, Los Angeles, and Chicago",
      size: "200+ luxury real estate agents",
      founded: "2005",
      focus: "High-end residential and commercial real estate"
    },
    testimonial: {
      quote: "CloudSeek transformed our brokerage with a tailored Salesforce solution. Our agents now have a unified view of clients and properties, with automated workflows that eliminate tedious manual processes. The impact on our bottom line has been remarkable, but even more valuable is the improved experience for both our agents and clients.",
      author: "Jennifer Ramirez",
      position: "CEO, Luxe Properties Group",
      avatar: "/images/avatars/jennifer-ramirez.jpg"
    },
    keyMetrics: [
      { label: "Conversion Rate Increase", value: "37%" },
      { label: "Reduction in Sales Cycle", value: "28%" },
      { label: "Agent Productivity Improvement", value: "45%" },
      { label: "Additional First-Year Revenue", value: "$2.4M" }
    ],
    heroImage: "/images/case-studies/luxe-properties-hero.jpg",
    galleryImages: [
      { src: "/images/case-studies/luxe-dashboard.jpg", alt: "Luxe Properties Dashboard", caption: "Custom agent performance dashboard" },
      { src: "/images/case-studies/luxe-mobile.jpg", alt: "Luxe Mobile App", caption: "Mobile application for field agents" },
      { src: "/images/case-studies/luxe-property-listing.jpg", alt: "Property Listing Interface", caption: "Integrated property listing management" }
    ],
    relatedCaseStudies: [
      { title: "Coastal Developments: 215% Increase in Qualified Leads", slug: "coastal-developments-sales-transformation" },
      { title: "Metro Property Management: Tenant Experience & Operations Optimization", slug: "metro-property-tenant-experience" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Luxe Properties Case Study | CloudSeek</title>
        <meta name="description" content="How CloudSeek revolutionized the luxury real estate experience through digital innovation and personalized customer journeys." />
      </Helmet>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-900 py-24">
          <div className="absolute inset-0 opacity-40">
            <img 
              src={caseStudy.heroImage} 
              alt={caseStudy.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent"></div>
          </div>
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

        {/* Client Overview */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Client Overview</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Company</p>
                      <p className="font-medium text-gray-900">{caseStudy.clientInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Industry</p>
                      <p className="font-medium text-gray-900">{caseStudy.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Size</p>
                      <p className="font-medium text-gray-900">{caseStudy.clientInfo.size}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Founded</p>
                      <p className="font-medium text-gray-900">{caseStudy.clientInfo.founded}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600 text-sm">Location</p>
                      <p className="font-medium text-gray-900">{caseStudy.clientInfo.location}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600 text-sm">Focus</p>
                      <p className="font-medium text-gray-900">{caseStudy.clientInfo.focus}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-start mb-4">
                    <div className="text-blue-600 mr-4 flex-shrink-0">
                      <Quote size={40} />
                    </div>
                    <p className="italic text-gray-700">"{caseStudy.testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center mt-6">
                    <img 
                      src={caseStudy.testimonial.avatar} 
                      alt={caseStudy.testimonial.author} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{caseStudy.testimonial.author}</p>
                      <p className="text-gray-600 text-sm">{caseStudy.testimonial.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge and Solution */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:gap-16">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">{caseStudy.challenge}</p>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">The Solution</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">{caseStudy.solution}</p>
                <ul className="space-y-3 mb-8">
                  {caseStudy.solutionPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 flex-shrink-0 mt-1">
                        <Check size={18} />
                      </span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Implementation Highlights</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">{caseStudy.implementation}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {caseStudy.technology.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                  {caseStudy.galleryImages.map((image, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Results Achieved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {caseStudy.keyMetrics.map((metric, index) => (
                <div key={index} className="bg-blue-800 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold mb-2">{metric.value}</p>
                  <p className="text-blue-200">{metric.label}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Detailed Outcomes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-700 p-2 rounded-full mr-4 flex-shrink-0">
                      <Check size={16} className="text-white" />
                    </div>
                    <p className="text-blue-100 text-lg">{result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Related Case Studies
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {/* Coastal Developments case study */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Coastal Developments: 215% Increase in Qualified Leads
                </h3>
                <a 
                  href="/case-studies/coastal-developments" 
                  className="inline-flex items-center text-blue-600 font-medium">
                  Read case study
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </div>

              {/* Metro Property Management case study */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Metro Property Management: Tenant Experience & Operations Optimization
                </h3>
                <a 
                  href="/case-studies/metro-property-management" 
                  className="inline-flex items-center text-blue-600 font-medium">
                  Read case study
                  <ChevronRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 py-16 rounded-2xl overflow-hidden w-[94%] mx-auto my-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Real Estate Business?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Let's discuss how CloudSeek can help your organization achieve exceptional results with Salesforce.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Schedule a Consultation
              </Link>
              <Link 
                to="/services/real-estate" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                Explore Real Estate Solutions
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LuxeProperties; 