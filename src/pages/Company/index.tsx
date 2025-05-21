import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Award, TrendingUp, Shield } from 'lucide-react';

const Company = () => {
  return (
    <div className="pt-12 pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About CloudSeek</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            CloudSeek is a premier Salesforce implementation partner focused on delivering innovative solutions that drive business growth and exceptional customer experiences.
          </p>
          {/* Get in Touch button removed */}
        </div>
      </div>

      {/* About CloudSeek Section - Expanded */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2015, CloudSeek began with a simple mission: to help businesses harness the full potential of Salesforce technology. What started as a small team of passionate Salesforce experts has grown into a comprehensive consulting and implementation partner trusted by organizations across industries.
              </p>
              <p>
                Our team brings together decades of combined experience in cloud technology, business process optimization, and customer relationship management. We pride ourselves on our technical excellence, deep industry knowledge, and commitment to delivering measurable results for our clients.
              </p>
              <p>
                At CloudSeek, we believe that successful digital transformation goes beyond technology implementation. It requires a strategic approach that aligns people, processes, and platforms. This philosophy guides every project we undertake, ensuring that our solutions not only meet immediate technical requirements but also support long-term business objectives.
              </p>
              <p>
                As Salesforce technology continues to evolve, so does our expertise. We invest heavily in ongoing training and certification to stay at the forefront of innovation and provide our clients with cutting-edge solutions that drive growth, efficiency, and competitive advantage.
              </p>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src="/images/company/team-photo.jpg" 
              alt="CloudSeek Team" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Rest of the company page remains the same */}
      {/* ... */}
    </div>
  );
};

export default Company; 