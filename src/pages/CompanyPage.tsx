import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Award, Users, Star, Zap, Shield, Lightbulb, Code, RefreshCw } from 'lucide-react';

const CompanyPage: React.FC = () => {
  // Company values for new section
  const companyValues = [
    {
      title: "Innovation",
      description: "We constantly explore new technologies and approaches to deliver cutting-edge solutions for our clients.",
      icon: "Lightbulb"
    },
    {
      title: "Excellence",
      description: "We are committed to the highest standards of quality in everything we do, from code to customer service.",
      icon: "Award"
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork—both within our organization and in partnership with our clients.",
      icon: "Users"
    },
    {
      title: "Integrity",
      description: "We build relationships based on trust, honesty, and transparent communication.",
      icon: "Shield"
    }
  ];

  // Our services section (replacing Transforming Businesses)
  const services = [
    {
      title: "Custom Development",
      description: "Bespoke Salesforce solutions designed to meet your specific business requirements.",
      icon: <Code size={32} />
    },
    {
      title: "System Integration",
      description: "Seamless integration between Salesforce and your existing systems for unified operations.",
      icon: <RefreshCw size={32} />
    },
    {
      title: "Implementation",
      description: "Expert Salesforce setup and configuration to ensure successful adoption.",
      icon: <Zap size={32} />
    }
  ];

  // Updated locations array
  const locations = [
    {
      id: 'north-carolina',
      city: 'North Carolina',
      country: 'United States',
      address: '75 Technology Drive, Suite 300',
      type: 'Headquarters',
      color: 'bg-blue-600'
    },
    {
      id: 'dubai',
      city: 'Dubai',
      country: 'UAE',
      address: 'Sheikh Zayed Road, Business Bay Tower',
      type: 'Regional Office',
      color: 'bg-blue-500'
    },
    {
      id: 'lahore',
      city: 'Lahore',
      country: 'Pakistan',
      address: 'Arfa Software Technology Park',
      type: 'Regional Office',
      color: 'bg-blue-500'
    }
  ];

  // Helper function to render icon based on string name
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "Lightbulb": return <Lightbulb size={24} />;
      case "Award": return <Award size={24} />;
      case "Users": return <Users size={24} />;
      case "Shield": return <Shield size={24} />;
      default: return <Star size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About CloudSeek | Global Salesforce Implementation Partner</title>
        <meta name="description" content="CloudSeek is a premier Salesforce implementation partner with a global presence, dedicated to helping businesses transform through innovative cloud solutions." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f1628]"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              About CloudSeek
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              CloudSeek is a premier Salesforce implementation partner focused on delivering innovative solutions that drive business growth and exceptional customer experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These guiding principles define our approach and shape everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">
                  {renderIcon(value.icon)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section - replacement for Transforming Businesses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized solutions designed to optimize your Salesforce investment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-blue-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated professionals committed to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <img src="/images/team/sami-azam.jpg" alt="Sami Azam" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 text-center">Sami Azam</h3>
              <p className="text-blue-600 text-center mb-4">Chief Executive Officer</p>
              <p className="text-gray-600 text-center">A visionary leader with extensive experience in digital transformation and Salesforce implementation.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <img src="/images/team/kaleem-azam.jpg" alt="Kaleem Azam" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 text-center">Kaleem Azam</h3>
              <p className="text-blue-600 text-center mb-4">Chief Technology Officer</p>
              <p className="text-gray-600 text-center">A certified Salesforce technical architect with a passion for building scalable, future-proof solutions that drive business value.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <img src="/images/team/jennifer-chen.jpg" alt="Jennifer Chen" className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 text-center">Jennifer Chen</h3>
              <p className="text-blue-600 text-center mb-4">VP of Customer Success</p>
              <p className="text-gray-600 text-center">Dedicated to ensuring our clients achieve and exceed their business objectives through effective Salesforce adoption and optimization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Global Presence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategically located to serve clients worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="space-y-6">
                {locations.map(location => (
                  <div key={location.id} className="flex items-start">
                    <div className={`w-3 h-3 rounded-full ${location.color} mt-2 mr-4`}></div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{location.city}, {location.country}</h3>
                      <p className="text-gray-600">{location.address}</p>
                      <p className="text-sm text-blue-600">{location.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[400px]">
              <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/world-map.svg')] bg-no-repeat bg-center bg-contain">
                  {/* North Carolina */}
                  <div className="absolute top-[35%] left-[25%]">
                    <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-75 absolute"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full relative flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Dubai */}
                  <div className="absolute top-[42%] left-[60%]">
                    <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping opacity-75 absolute animation-delay-300"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full relative flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Lahore */}
                  <div className="absolute top-[38%] left-[65%]">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75 absolute animation-delay-600"></div>
                    <div className="w-6 h-6 bg-blue-500 rounded-full relative flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Location labels */}
                  <div className="absolute top-[30%] left-[25%] text-sm font-bold text-blue-600">North Carolina, USA (HQ)</div>
                  <div className="absolute top-[47%] left-[60%] text-sm font-bold text-blue-600">Dubai, UAE</div>
                  <div className="absolute top-[33%] left-[65%] text-sm font-bold text-blue-600">Lahore, Pakistan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f1628]"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Let our expert team help you leverage the full power of Salesforce to drive growth and deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg"
            >
              Get in Touch
            </Link>
            <Link 
              to="/case-studies" 
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-lg font-medium"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyPage; 