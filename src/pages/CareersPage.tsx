import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, CheckCircle, Coffee, BookOpen, Heart, Clock, DollarSign } from 'lucide-react';

const CareersPage: React.FC = () => {
  // Company locations matching the company page
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
  
  // Benefits
  const benefits = [
    {
      title: 'Competitive Compensation',
      description: 'Salary packages that recognize your skills and experience',
      icon: <DollarSign className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive healthcare coverage for you and your family',
      icon: <Heart className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Learning & Development',
      description: 'Budget for conferences, certifications, and online courses',
      icon: <BookOpen className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Work-Life Balance',
      description: 'Flexible working hours and remote work options',
      icon: <Clock className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Team Building',
      description: 'Regular team activities, retreats, and social events',
      icon: <Coffee className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Career Growth',
      description: 'Clear career paths and regular performance reviews',
      icon: <Briefcase className="w-6 h-6 text-blue-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Careers at CloudSeek | Join Our Team</title>
        <meta name="description" content="Explore career opportunities at CloudSeek, a leading Salesforce implementation partner with offices across the globe." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0f1628] py-20">
        {/* Animated Shapes Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="absolute top-60 -left-20 h-60 w-60 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-60 h-40 w-40 rounded-full bg-blue-300 opacity-20 blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Join Our<br />
            <span className="text-blue-300">Global Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Help us build innovative solutions that transform businesses and elevate customer experiences.
          </p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Join CloudSeek?</h2>
            <p className="mt-4 text-xl text-gray-600">Be part of a team that's shaping the future of customer experiences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/images/team-collaboration.jpg" 
                alt="CloudSeek team collaboration" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold text-gray-900">Innovative Work</h3>
                  <p className="mt-2 text-gray-600">Work on cutting-edge Salesforce implementations for leading global brands across industries.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold text-gray-900">Career Growth</h3>
                  <p className="mt-2 text-gray-600">Clear advancement paths with mentorship from industry experts and hands-on leadership opportunities.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold text-gray-900">Global Collaboration</h3>
                  <p className="mt-2 text-gray-600">Join a diverse team working across multiple locations, bringing unique perspectives to every challenge.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-xl font-bold text-gray-900">Work-Life Balance</h3>
                  <p className="mt-2 text-gray-600">Flexible working arrangements that respect your personal time and promote wellbeing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits & Perks Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Benefits & Perks</h2>
            <p className="mt-4 text-xl text-gray-600">We take care of our team so they can focus on what matters</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow p-8 hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-500"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-6 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Open Positions</h2>
            <p className="mt-4 text-xl text-gray-600">Find the perfect role for your skills and interests</p>
          </div>
          
          {/* No jobs message */}
          <div className="text-center py-16 bg-blue-50 rounded-xl mb-12">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">No openings at the moment</h3>
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-6">
              We don't have any positions available right now, but we're always looking for talented individuals to join our team.
            </p>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              Please check back soon or send your resume to <a href="mailto:careers@cloudseek.io" className="text-blue-600 hover:underline">careers@cloudseek.io</a> for future opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Our Locations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Locations</h2>
            <p className="mt-4 text-xl text-gray-600">Explore opportunities across our global offices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((location) => (
              <div 
                key={location.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`h-3 ${location.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`flex-shrink-0 w-10 h-10 ${location.color} rounded-full flex items-center justify-center`}>
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {location.city}, {location.country}
                        {location.type === 'Headquarters' && (
                          <span className="ml-2 text-xs uppercase font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                            HQ
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{location.address}</p>
                  
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-500">
                      0 open positions
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Hiring Process</h2>
            <p className="mt-4 text-xl text-gray-600">Simple, transparent, and designed to find the right fit</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="relative flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full border-4 border-blue-200 bg-white flex items-center justify-center relative z-10">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Application</h3>
              <p className="text-gray-600 text-center">
                Submit your application through our careers portal with your resume and cover letter.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full border-4 border-blue-200 bg-white flex items-center justify-center relative z-10">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Initial Review</h3>
              <p className="text-gray-600 text-center">
                Our recruitment team reviews applications and schedules initial screening calls.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full border-4 border-blue-200 bg-white flex items-center justify-center relative z-10">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Interviews</h3>
              <p className="text-gray-600 text-center">
                Technical and cultural interviews with team members and leadership.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative flex items-center justify-center mb-6">
                <div className="h-12 w-12 rounded-full border-4 border-blue-200 bg-white flex items-center justify-center relative z-10">
                  <span className="text-blue-600 font-bold text-lg">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Offer</h3>
              <p className="text-gray-600 text-center">
                Successful candidates receive competitive offers and prepare to join our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with buttons */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f1628]"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Build Your Career With Us</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join our global team of innovators and help shape the future of business transformation with Salesforce.
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:careers@cloudseek.io" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Submit Your Resume
            </a>
            <Link 
              to="/contact" 
              className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage; 