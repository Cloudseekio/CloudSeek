import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Building, ChevronRight, Home, Users, Zap, Quote } from 'lucide-react';

const RealEstateCaseStudies: React.FC = () => {
  console.log("RealEstateCaseStudies component rendered");
  
  // Define detailed case studies for real estate
  const caseStudies = [
    {
      id: 'luxe-properties',
      title: 'Luxe Properties Group',
      subtitle: 'Digital Transformation & CRM Implementation',
      challenge: 'Luxe Properties, a luxury real estate brokerage with 200+ agents, struggled with fragmented customer data and inefficient lead management.',
      solution: 'We implemented a custom Salesforce Real Estate Cloud solution with integrated marketing automation, agent performance dashboards, and mobile functionality.',
      results: [
        'Increased lead conversion rate by 37%',
        '28% reduction in average sales cycle',
        'Improved agent productivity by 45%',
        '$2.4M additional revenue in first year'
      ],
      image: '/images/case-studies/luxe-properties.jpg',
      testimonial: {
        quote: "CloudSeek transformed our brokerage with a tailored Salesforce solution. Our agents now have a unified view of clients and properties, with automated workflows that eliminate tedious manual processes.",
        author: "Jennifer Ramirez",
        position: "CEO, Luxe Properties Group",
        avatar: "/images/avatars/jennifer-ramirez.jpg"
      },
      tags: ['Real Estate Cloud', 'Marketing Automation', 'Mobile Solutions', 'Agent Productivity']
    },
    {
      id: 'coastal-developments',
      title: 'Coastal Developments',
      subtitle: 'Sales & Marketing Transformation',
      challenge: 'Coastal Developments, a residential property developer, struggled to track leads across multiple development projects and lacked visibility into their marketing ROI.',
      solution: 'We implemented Salesforce Sales Cloud with Pardot integration, custom project tracking, and comprehensive marketing attribution.',
      results: [
        '215% increase in qualified leads',
        '42% improvement in marketing ROI',
        '23% higher closing rate on new developments',
        'Real-time visibility across all projects'
      ],
      image: '/images/case-studies/coastal-developments.jpg',
      testimonial: {
        quote: "CloudSeek helped us implement a solution that finally gives us clear insight into our marketing performance and streamlines our sales process from lead to closing. The impact on our business has been remarkable.",
        author: "Sarah Martinez",
        position: "Marketing Director, Coastal Developments",
        avatar: "/images/avatars/sarah-martinez.jpg"
      },
      tags: ['Sales Cloud', 'Pardot', 'Marketing Attribution', 'Project Management']
    },
    {
      id: 'metro-property-management',
      title: 'Metro Property Management',
      subtitle: 'Tenant Experience & Operations Optimization',
      challenge: 'Metro Property Management managed 5,000+ rental units but struggled with tenant communication, maintenance requests, and operational inefficiencies.',
      solution: 'We developed a custom Salesforce Service Cloud implementation with a tenant portal, maintenance tracking system, and operational dashboards.',
      results: [
        '53% faster resolution of maintenance requests',
        '67% reduction in tenant communication issues',
        '32% increase in tenant retention',
        '$350K annual savings in operational costs'
      ],
      image: '/images/case-studies/metro-property.jpg',
      testimonial: {
        quote: "The Salesforce solution CloudSeek implemented has revolutionized how we manage our properties. Tenants are happier with faster service, and our team is more efficient with powerful automation tools and analytics.",
        author: "David Chen",
        position: "Operations Manager, Metro Property Management",
        avatar: "/images/avatars/david-chen.jpg"
      },
      tags: ['Service Cloud', 'Community Portal', 'Field Service', 'Operational Excellence']
    }
  ];

  // Industry stats
  const industryStats = [
    { value: "63%", label: "of real estate firms see technology as crucial for their future success" },
    { value: "47%", label: "of agents say better CRM would improve their business significantly" },
    { value: "85%", label: "of real estate buyers start their search online" },
    { value: "3.7x", label: "higher revenue for digitally transformed real estate businesses" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Estate Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How leading real estate organizations are achieving digital transformation with CloudSeek and Salesforce
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {industryStats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <p className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</p>
                <p className="text-gray-700 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Real Estate Case Studies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map(study => (
              <div key={study.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-bold">{study.title}</h3>
                    <p className="text-blue-100 text-sm">{study.subtitle}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-gray-800 font-semibold mb-2">Challenge:</h4>
                    <p className="text-gray-600 text-sm">{study.challenge}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-gray-800 font-semibold mb-2">Results:</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {study.results.slice(0, 2).map((result, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to={`/case-studies/${study.id}`} className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                    Read full case study
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Case Study Detail */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{caseStudies[0].title}</h2>
              <p className="text-xl text-gray-600 mb-6">{caseStudies[0].subtitle}</p>
              
              <div className="mb-6">
                <h3 className="text-gray-800 font-semibold mb-2">Challenge:</h3>
                <p className="text-gray-600">{caseStudies[0].challenge}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-gray-800 font-semibold mb-2">Solution:</h3>
                <p className="text-gray-600">{caseStudies[0].solution}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-gray-800 font-semibold mb-2">Results:</h3>
                <ul className="text-gray-600 space-y-2">
                  {caseStudies[0].results.map((result, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link to={`/case-studies/${caseStudies[0].id}`} className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                View detailed case study
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-4">
                    <Quote size={40} />
                  </div>
                  <p className="italic text-gray-700">{caseStudies[0].testimonial.quote}</p>
                </div>
                <div className="flex items-center">
                  <img 
                    src={caseStudies[0].testimonial.avatar} 
                    alt={caseStudies[0].testimonial.author} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{caseStudies[0].testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{caseStudies[0].testimonial.position}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Related Services for Real Estate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our specialized offerings for the real estate industry
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Building size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Salesforce for Real Estate</h3>
              <p className="text-gray-600 mb-4">
                Customized Salesforce implementations specifically designed for property management, brokerage operations, and real estate development.
              </p>
              <Link to="/salesforce-consulting" className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tenant & Property Management</h3>
              <p className="text-gray-600 mb-4">
                Streamline tenant communications, maintenance requests, and property operations with our tailored Salesforce Service Cloud solutions.
              </p>
              <Link to="/salesforce-service-cloud" className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <BarChart2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Estate Analytics</h3>
              <p className="text-gray-600 mb-4">
                Gain actionable insights into market trends, property performance, and sales metrics with our Salesforce analytics solutions.
              </p>
              <Link to="/salesforce-analytics" className="text-blue-600 font-medium flex items-center hover:text-blue-700">
                Learn more <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 rounded-2xl overflow-hidden w-[94%] mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Real Estate Business?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Let's discuss how CloudSeek can help your organization achieve exceptional results with Salesforce
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
            >
              Schedule a Consultation
            </Link>
            <Link 
              to="/case-studies?industry=real-estate" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              View All Real Estate Case Studies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RealEstateCaseStudies; 