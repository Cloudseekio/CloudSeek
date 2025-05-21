import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Quote, BarChart, Clock, Users, Building, ArrowRight, Award, Star } from 'lucide-react';

const MetroPropertyManagement: React.FC = () => {
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
                Real Estate
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Metro Property Management
              </h1>
              <p className="text-2xl text-blue-100 mb-8">
                Tenant Experience & Operations Optimization
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Faster Maintenance Resolution</p>
                  <p className="text-3xl font-bold text-white">53%</p>
                </div>
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Reduced Communication Issues</p>
                  <p className="text-3xl font-bold text-white">67%</p>
                </div>
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-lg">
                  <p className="text-blue-300 text-sm">Increase in Tenant Retention</p>
                  <p className="text-3xl font-bold text-white">32%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-md mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Challenge</h2>
              <p className="text-gray-700 mb-6">
                Metro Property Management managed 5,000+ rental units but struggled with tenant 
                communication, maintenance requests, and operational inefficiencies.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Solution</h2>
              <p className="text-gray-700 mb-4">
                We developed a custom Salesforce Service Cloud implementation with a tenant portal, 
                maintenance tracking system, and operational dashboards.
              </p>
              <ul className="list-disc pl-6 mb-8 text-gray-700">
                <li className="mb-2">Custom tenant community portal</li>
                <li className="mb-2">Mobile maintenance request system</li>
                <li className="mb-2">Automated workflow management</li>
                <li className="mb-2">Performance analytics dashboards</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  "53% faster resolution of maintenance requests",
                  "67% reduction in tenant communication issues",
                  "32% increase in tenant retention",
                  "$350K annual savings in operational costs"
                ].map((result, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <p className="text-gray-700">{result}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8 border-l-4 border-blue-500">
                <p className="italic text-gray-700 mb-4">
                  "The Salesforce solution CloudSeek implemented has revolutionized how we manage our properties. 
                  Tenants are happier with faster service, and our team is more efficient with powerful automation tools and analytics."
                </p>
                <p className="font-medium text-gray-900">David Chen, Operations Manager</p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block transition-colors text-lg font-medium">
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MetroPropertyManagement; 