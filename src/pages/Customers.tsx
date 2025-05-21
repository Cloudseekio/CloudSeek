import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import RealEstateCaseStudies from '../components/RealEstateCaseStudies';

const Customers: React.FC = () => {
  const [activeIndustry, setActiveIndustry] = useState('all');

  // Log when component mounts
  useEffect(() => {
    console.log("Customers component mounted");
  }, []);

  // Industry tabs for filtering
  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'real-estate', name: 'Real Estate' },
    { id: 'financial', name: 'Financial Services' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'retail', name: 'Retail' }
  ];

  // Featured customers
  const featuredCustomers = [
    {
      name: 'Global Financial Corp',
      industry: 'Financial Services',
      logo: '/images/customers/global-financial.png',
      description: 'Leading financial services company with operations in 30+ countries.',
    },
    {
      name: 'Horizon Healthcare',
      industry: 'Healthcare',
      logo: '/images/customers/horizon-healthcare.png',
      description: 'Innovative healthcare provider serving over 2 million patients annually.',
    },
    {
      name: 'TechManufacturing Inc',
      industry: 'Manufacturing',
      logo: '/images/customers/tech-manufacturing.png',
      description: 'Precision manufacturing company specializing in high-tech components.',
    },
    {
      name: 'Luxe Properties Group',
      industry: 'Real Estate',
      logo: '/images/customers/luxe-properties.png',
      description: 'Luxury real estate brokerage with 200+ agents across major metropolitan areas.',
    },
    {
      name: 'Metro Retail Solutions',
      industry: 'Retail',
      logo: '/images/customers/metro-retail.png',
      description: 'Omnichannel retail company with 150+ locations nationwide.',
    },
    {
      name: 'Coastal Developments',
      industry: 'Real Estate',
      logo: '/images/customers/coastal-developments.png',
      description: 'Residential property developer focusing on sustainable coastal communities.',
    }
  ];

  // Filter customers based on selected industry
  const filteredCustomers = activeIndustry === 'all' 
    ? featuredCustomers 
    : featuredCustomers.filter(customer => 
        customer.industry.toLowerCase().replace(' ', '-') === activeIndustry
      );

  // Enhanced logging
  console.log("Current industry filter:", activeIndustry);
  
  // Handler with logging
  const handleIndustryChange = (industryId) => {
    console.log("Changing industry to:", industryId);
    setActiveIndustry(industryId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Customers
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover how leading organizations across industries are achieving digital transformation with CloudSeek
          </p>
        </div>
      </section>

      {/* Featured Customers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join the growing list of companies that rely on CloudSeek for their digital transformation needs
            </p>
          </div>

          {/* Industry Filter Tabs - updated with enhanced handler */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {industries.map(industry => (
              <button
                key={industry.id}
                onClick={() => handleIndustryChange(industry.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeIndustry === industry.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {industry.name}
              </button>
            ))}
          </div>

          {/* Customer Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCustomers.map((customer, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <img
                  src={customer.logo}
                  alt={customer.name}
                  className="h-16 mb-4 object-contain"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{customer.name}</h3>
                <p className="text-sm text-blue-600 mb-4">{customer.industry}</p>
                <p className="text-gray-600 mb-6">{customer.description}</p>
                <Link to={`/case-studies/${customer.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                  View success story
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Debug info - visible for troubleshooting */}
      <div className="max-w-7xl mx-auto px-4 mb-4 text-gray-500 text-sm">
        Current filter: {activeIndustry} | Should show Real Estate component: {activeIndustry === 'real-estate' ? 'Yes' : 'No'}
      </div>

      {/* RealEstateCaseStudies with more explicit rendering condition */}
      {console.log("Rendering check:", activeIndustry === 'real-estate' ? "Should render" : "Should not render")}
      {activeIndustry === 'real-estate' && (
        <RealEstateCaseStudies />
      )}

      {/* Success Metrics */}
      {activeIndustry === 'all' && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Customer Success Metrics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Measurable results our customers have achieved
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">93%</p>
                <p className="text-gray-700">Customer satisfaction rate</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">145%</p>
                <p className="text-gray-700">Average ROI</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">37%</p>
                <p className="text-gray-700">Efficiency improvement</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">250+</p>
                <p className="text-gray-700">Successful implementations</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear directly from our customers about their experiences working with CloudSeek
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="absolute -top-4 -right-4 text-blue-500">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 25H5V17.5H12.5V25ZM27.5 25H20V17.5H27.5V25Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.25 10C5.69365 10 2 13.6936 2 18.25V26.75C2 28.8211 3.67893 30.5 5.75 30.5H11.75C13.8211 30.5 15.5 28.8211 15.5 26.75V18.25C15.5 16.1789 13.8211 14.5 11.75 14.5H8.5V18.25C8.5 16.1789 6.82107 14.5 4.75 14.5H3.5V18.25C3.5 14.5219 6.52192 11.5 10.25 11.5H11.75C15.4781 11.5 18.5 14.5219 18.5 18.25V26.75C18.5 30.4781 15.4781 33.5 11.75 33.5H5.75C2.02192 33.5 -1 30.4781 -1 26.75V18.25C-1 12.1716 4.17157 7 10.25 7V10ZM25.25 10C20.6937 10 17 13.6936 17 18.25V26.75C17 28.8211 18.6789 30.5 20.75 30.5H26.75C28.8211 30.5 30.5 28.8211 30.5 26.75V18.25C30.5 16.1789 28.8211 14.5 26.75 14.5H23.5V18.25C23.5 16.1789 21.8211 14.5 19.75 14.5H18.5V18.25C18.5 14.5219 21.5219 11.5 25.25 11.5H26.75C30.4781 11.5 33.5 14.5219 33.5 18.25V26.75C33.5 30.4781 30.4781 33.5 26.75 33.5H20.75C17.0219 33.5 14 30.4781 14 26.75V18.25C14 12.1716 19.1716 7 25.25 7V10Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="mb-3 mt-3">
                <div className="flex text-yellow-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "CloudSeek's team truly understood our business needs and delivered a solution that exceeded our expectations. Their expertise in Salesforce implementation has transformed our operations."
              </p>
              <div className="flex items-center">
                <img 
                  src="/images/testimonials/john-smith.jpg" 
                  alt="John Smith" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">John Smith</p>
                  <p className="text-gray-600 text-sm">CIO, Global Financial Corp</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="absolute -top-4 -right-4 text-blue-500">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 25H5V17.5H12.5V25ZM27.5 25H20V17.5H27.5V25Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.25 10C5.69365 10 2 13.6936 2 18.25V26.75C2 28.8211 3.67893 30.5 5.75 30.5H11.75C13.8211 30.5 15.5 28.8211 15.5 26.75V18.25C15.5 16.1789 13.8211 14.5 11.75 14.5H8.5V18.25C8.5 16.1789 6.82107 14.5 4.75 14.5H3.5V18.25C3.5 14.5219 6.52192 11.5 10.25 11.5H11.75C15.4781 11.5 18.5 14.5219 18.5 18.25V26.75C18.5 30.4781 15.4781 33.5 11.75 33.5H5.75C2.02192 33.5 -1 30.4781 -1 26.75V18.25C-1 12.1716 4.17157 7 10.25 7V10ZM25.25 10C20.6937 10 17 13.6936 17 18.25V26.75C17 28.8211 18.6789 30.5 20.75 30.5H26.75C28.8211 30.5 30.5 28.8211 30.5 26.75V18.25C30.5 16.1789 28.8211 14.5 26.75 14.5H23.5V18.25C23.5 16.1789 21.8211 14.5 19.75 14.5H18.5V18.25C18.5 14.5219 21.5219 11.5 25.25 11.5H26.75C30.4781 11.5 33.5 14.5219 33.5 18.25V26.75C33.5 30.4781 30.4781 33.5 26.75 33.5H20.75C17.0219 33.5 14 30.4781 14 26.75V18.25C14 12.1716 19.1716 7 25.25 7V10Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="mb-3 mt-3">
                <div className="flex text-yellow-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The digital marketing strategy CloudSeek implemented has dramatically increased our lead generation and conversion rates. Their data-driven approach delivers measurable results."
              </p>
              <div className="flex items-center">
                <img 
                  src="/images/testimonials/sarah-jones.jpg" 
                  alt="Sarah Jones" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">Sarah Jones</p>
                  <p className="text-gray-600 text-sm">Marketing Director, Horizon Healthcare</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="absolute -top-4 -right-4 text-blue-500">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 25H5V17.5H12.5V25ZM27.5 25H20V17.5H27.5V25Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.25 10C5.69365 10 2 13.6936 2 18.25V26.75C2 28.8211 3.67893 30.5 5.75 30.5H11.75C13.8211 30.5 15.5 28.8211 15.5 26.75V18.25C15.5 16.1789 13.8211 14.5 11.75 14.5H8.5V18.25C8.5 16.1789 6.82107 14.5 4.75 14.5H3.5V18.25C3.5 14.5219 6.52192 11.5 10.25 11.5H11.75C15.4781 11.5 18.5 14.5219 18.5 18.25V26.75C18.5 30.4781 15.4781 33.5 11.75 33.5H5.75C2.02192 33.5 -1 30.4781 -1 26.75V18.25C-1 12.1716 4.17157 7 10.25 7V10ZM25.25 10C20.6937 10 17 13.6936 17 18.25V26.75C17 28.8211 18.6789 30.5 20.75 30.5H26.75C28.8211 30.5 30.5 28.8211 30.5 26.75V18.25C30.5 16.1789 28.8211 14.5 26.75 14.5H23.5V18.25C23.5 16.1789 21.8211 14.5 19.75 14.5H18.5V18.25C18.5 14.5219 21.5219 11.5 25.25 11.5H26.75C30.4781 11.5 33.5 14.5219 33.5 18.25V26.75C33.5 30.4781 30.4781 33.5 26.75 33.5H20.75C17.0219 33.5 14 30.4781 14 26.75V18.25C14 12.1716 19.1716 7 25.25 7V10Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="mb-3 mt-3">
                <div className="flex text-yellow-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Working with CloudSeek has been a game-changer for our manufacturing operations. Their custom Salesforce solution has streamlined our processes and improved visibility across our supply chain."
              </p>
              <div className="flex items-center">
                <img 
                  src="/images/testimonials/michael-johnson.jpg" 
                  alt="Michael Johnson" 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">Michael Johnson</p>
                  <p className="text-gray-600 text-sm">Operations Director, TechManufacturing Inc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 rounded-2xl overflow-hidden w-[94%] mx-auto mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Let's discuss how we can help you achieve your business objectives and drive digital transformation
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium flex items-center justify-center"
            >
              Schedule a Consultation
              <ChevronRight size={16} className="ml-2" />
            </Link>
            <Link 
              to="/case-studies" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium flex items-center justify-center"
            >
              View All Case Studies
              <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Customers; 