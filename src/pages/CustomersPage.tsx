import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CustomersPage: React.FC = () => {
  const [activeIndustry, setActiveIndustry] = useState<string>('All');
  
  // Industry filters
  const industries = [
    'All', 
    'Real Estate', 
    'Technology', 
    'Retail', 
    'Financial Services', 
    'Professional Services',
    'Healthcare'
  ];
  
  // Using existing case studies with their paths/links
  const caseStudies = [
    {
      id: 'luxe-properties',
      title: 'Luxury Real Estate Digital Transformation',
      company: 'Luxe Properties',
      industry: 'Real Estate',
      description: 'How we revolutionized the luxury real estate experience through digital innovation and personalized customer journeys.',
      image: '/images/case-studies/luxe-properties-background.jpg',
      link: '/case-studies/luxe-properties',
      featured: true,
      stats: ['75% increase in qualified leads', '42% reduction in sales cycle']
    },
    {
      id: 'techforward',
      title: 'Customer Lifetime Value Enhancement',
      company: 'TechForward',
      industry: 'Technology',
      description: 'How we helped a SaaS provider increase customer lifetime value and reduce churn through targeted engagement strategies.',
      image: '/images/case-studies/techforward-background.jpg',
      link: '/case-studies/techforward-customer-lifetime-value',
      featured: true,
      stats: ['3.2x increase in customer lifetime value', '64% reduction in churn rate']
    },
    {
      id: 'coastal-developments',
      title: 'Lead Generation & Conversion',
      company: 'Coastal Developments',
      industry: 'Real Estate',
      description: 'How we helped a coastal property developer increase qualified leads by 215% and improve conversion rates.',
      image: '/images/case-studies/coastal-developments.jpg',
      link: '/case-studies/coastal-developments'
    },
    {
      id: 'metro-property',
      title: 'Property Management Transformation',
      company: 'Metro Property Management',
      industry: 'Real Estate',
      description: 'How we streamlined operations and enhanced tenant experience for a property management company.',
      image: '/images/case-studies/metro-property.jpg',
      link: '/case-studies/metro-property-management'
    },
    {
      id: 'strategic-consulting',
      title: 'Client Management & Analytics',
      company: 'Strategic Consulting Group',
      industry: 'Professional Services',
      description: 'How we unified client data to provide a 360° view and enable data-driven decision making.',
      image: '/images/case-studies/strategic-consulting.jpg',
      link: '/case-studies/strategic-consulting-group',
      featured: true,
      stats: ['50% reduction in operational costs', '68% faster access to client information']
    },
    {
      id: 'retailnxt',
      title: 'Customer Retention Improvement',
      company: 'RetailNXT',
      industry: 'Retail',
      description: 'How we helped a retailer transform their customer experience to significantly improve retention and repeat purchases.',
      image: '/images/case-studies/retailnxt.jpg',
      link: '/case-studies/retailnxt-customer-retention'
    },
    {
      id: 'global-financial',
      title: 'Financial Services CRM',
      company: 'Global Financial Corp',
      industry: 'Financial Services',
      description: 'How we implemented a comprehensive CRM solution for a global financial services provider to streamline client management and reporting.',
      image: '/images/case-studies/global-financial-corp.jpg.jpg',
      link: '/case-studies/global-financial-corp',
      featured: true,
      stats: ['43% improvement in client retention', '58% faster reporting cycles']
    },
    {
      id: 'health-tech',
      title: 'Healthcare Innovation Platform',
      company: 'Health Tech Innovations',
      industry: 'Healthcare',
      description: 'How we built a digital platform to connect healthcare providers, patients, and innovators to improve healthcare delivery and outcomes.',
      image: '/images/case-studies/health-tech-innovations.jpg.jpg',
      link: '/case-studies/health-tech-innovations',
      featured: true,
      stats: ['37% reduction in patient wait times', '45% increase in provider efficiency']
    },
    {
      id: 'precision-manufacturing',
      title: 'Manufacturing Process Optimization',
      company: 'Precision Manufacturing',
      industry: 'Manufacturing',
      description: 'How we helped a manufacturer streamline operations and improve supply chain visibility.',
      image: '/images/case-studies/precision-manufacturing.jpg',
      link: '/case-studies/precision-manufacturing'
    },
    {
      id: 'fashion-forward',
      title: 'Retail Digital Transformation',
      company: 'Fashion Forward',
      industry: 'Retail',
      description: 'How we helped a fashion retailer build an omnichannel experience that bridges physical and digital shopping.',
      image: '/images/case-studies/fashion-forward.jpg',
      link: '/case-studies/fashion-forward'
    },
    {
      id: 'tech-vision',
      title: 'IT Services Automation',
      company: 'Tech Vision',
      industry: 'Technology',
      description: 'How we automated core business processes for an IT services company to improve efficiency and scalability while reducing operational costs.',
      image: '/images/case-studies/tech-solutions.jpg.jpg',
      link: '/case-studies/tech-vision',
      featured: true,
      stats: ['68% reduction in manual processes', '42% increase in service delivery speed']
    }
  ];
  
  const filteredCaseStudies = activeIndustry === 'All' 
    ? caseStudies 
    : caseStudies.filter(study => study.industry === activeIndustry);
  
  const featuredCaseStudies = filteredCaseStudies.filter(study => study.featured);
  const regularCaseStudies = filteredCaseStudies.filter(study => !study.featured);
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Customer Success Stories | CloudSeek</title>
        <meta name="description" content="Discover how leading organizations across industries achieve exceptional results with CloudSeek's Salesforce expertise." />
      </Helmet>

      {/* Simple Header Section with Alternative Heading */}
      <section className="pt-16 pb-10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transforming Business Through Innovation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how we've helped leading companies achieve extraordinary results
          </p>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="pb-12 pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {/* Display only the 5 specific logos requested */}
            <div className="flex items-center justify-center h-12">
              <span className="text-gray-800 font-semibold">Luxe Properties</span>
            </div>
            <div className="flex items-center justify-center h-12">
              <span className="text-gray-800 font-semibold">TechForward</span>
            </div>
            <div className="flex items-center justify-center h-12">
              <span className="text-gray-800 font-semibold">Coastal Developments</span>
            </div>
            <div className="flex items-center justify-center h-12">
              <span className="text-gray-800 font-semibold">Metro Property Management</span>
            </div>
            <div className="flex items-center justify-center h-12">
              <span className="text-gray-800 font-semibold">RetailNXT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {industries.map(industry => (
              <button
                key={industry}
                onClick={() => setActiveIndustry(industry)}
                className={`px-4 py-2 rounded-md text-sm ${
                  activeIndustry === industry
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies (Magazine Style) */}
      {featuredCaseStudies.length > 0 && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {featuredCaseStudies.map((study, index) => (
              <div 
                key={study.id} 
                className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} mb-16 last:mb-0`}
              >
                <div className="md:w-1/2 relative">
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-600/90 text-white rounded">
                      {study.industry}
                    </span>
                  </div>
                </div>
                <div className={`md:w-1/2 flex flex-col justify-center ${index % 2 !== 0 ? 'md:pr-12' : 'md:pl-12'} mt-6 md:mt-0`}>
                  <h3 className="text-sm uppercase font-medium text-blue-600 mb-2">{study.company}</h3>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{study.title}</h2>
                  <p className="text-gray-600 mb-6">{study.description}</p>
                  
                  {study.stats && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.stats.map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-semibold text-blue-600">{stat}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Link 
                    to={study.link}
                    className="inline-flex items-center text-blue-600 font-medium group"
                  >
                    Read case study 
                    <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Regular Case Studies - Magazine Grid Layout */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Magazine style grid with varying card sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
            {regularCaseStudies.map((study, index) => (
              <Link 
                key={study.id} 
                to={study.link}
                className={`group block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 
                           ${index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className="relative">
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    className={`w-full object-cover ${index % 5 === 0 ? 'h-80' : 'h-48'}`}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-600/90 text-white rounded">
                      {study.industry}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-sm uppercase font-medium text-gray-500 mb-1">{study.company}</h3>
                  <h2 className={`${index % 5 === 0 ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 mb-2 group-hover:text-blue-600`}>
                    {study.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{study.description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                    Read case study <ChevronRight className="ml-1 w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 w-[94%] mx-auto rounded-xl mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to create your own success story?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Let's discuss how we can help transform your business with tailored Salesforce solutions that drive measurable results.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition duration-300 text-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CustomersPage; 